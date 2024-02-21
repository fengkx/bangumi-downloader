import { RateLimit } from "npm:async-sema";
import retry from "https://esm.sh/async-retry@1.3.3";
import {
  BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "npm:@langchain/core/prompts";
import { AIMessage, HumanMessage } from "npm:@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "npm:@langchain/google-genai";

import { HarmBlockThreshold, HarmCategory } from "npm:@google/generative-ai";
import { examples } from "./prompts.ts";
import { Extractor, ResourceInfo, resourceInfoValidator } from "../common.ts";
import { BaseExtractor } from "../base-extractor.ts";
import { StorageRepo } from "../../../db/kysely.ts";

export class GeminiExtractor extends BaseExtractor implements Extractor {
  readonly model: ChatGoogleGenerativeAI;
  private readonly _cachePrefix = "gm-info";
  chatPrompt: ChatPromptTemplate<any, any>;
  private readonly _ratelimitter = RateLimit(30, { timeUnit: 1000 * 60 });
  constructor(API_KEY: string, private readonly storage?: StorageRepo) {
    super();
    this.model = new ChatGoogleGenerativeAI({
      modelName: "gemini-pro",
      maxOutputTokens: 4096,
      topK: 1,
      topP: 1,
      temperature: 0.45,
      apiKey: API_KEY,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const messages: BaseMessagePromptTemplateLike[] = [];
    examples.forEach((ex) => {
      messages.push(
        new HumanMessage(
          `You are a meida resource info extractor. Return resource info in strict valid json format from title: ${ex.input}`,
        ),
      );
      messages.push(new AIMessage(`${JSON.stringify(ex.output)}`));
    });

    messages.push(HumanMessagePromptTemplate.fromTemplate(`title: {title}`));
    const chatPrompt = ChatPromptTemplate.fromMessages(messages);
    this.chatPrompt = chatPrompt;
  }

  async getInfoFromTitle(title: string): Promise<ResourceInfo> {
    const key = `${this._cachePrefix}:${title}`;
    const cached = await this.storage?.cacheGet(key);
    if (cached) {
      return cached.value as ResourceInfo;
    }
    const prompt = await this.chatPrompt.formatMessages({ title });

    const r = await retry(async (b, attempt) => {
      await this._ratelimitter();
      console.info(`Extracting info from ${title}`);
      const r = await this.model.invoke(prompt);
      const result = JSON.parse(String(r.content)) as ResourceInfo;
      console.log(result, title);
      if (result.cn_title && !title.includes(result.cn_title) && attempt < 5) {
        throw new Error(`${result.cn_title} is not existed in ${title}`);
      }
      resourceInfoValidator.parse(result);
      return result;
    }, {
      retries: 5,
      onRetry(e, attempt) {
        console.info(`[Retries ${attempt}] extracting Cause: ${e.message}`);
      },
    });
    await this.storage?.cacheSet(key, r);
    return r;
  }
}
