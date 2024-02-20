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
import { Extractor, ResourceInfo } from "../common.ts";
import { BaseExtractor } from "../base-extractor.ts";
import { Storeage } from "../../db/kysely.ts";

export class GeminiExtractor extends BaseExtractor implements Extractor {
  readonly model: ChatGoogleGenerativeAI;
  private readonly _cachePrefix = 'gm-info'
  chatPrompt: ChatPromptTemplate<any, any>;
  private readonly _ratelimitter = RateLimit(30, { timeUnit: 1000 * 60 });
  constructor(API_KEY: string,  private readonly storage?: Storeage) {
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
      messages.push(new HumanMessage(`title: ${ex.input}`));
      messages.push(new AIMessage(`${JSON.stringify(ex.output)}`));
    });

    messages.push(HumanMessagePromptTemplate.fromTemplate(`title: {title}`));
    const chatPrompt = ChatPromptTemplate.fromMessages(messages);
    this.chatPrompt = chatPrompt;
  }

  async getInfoFromTitle(title: string): Promise<ResourceInfo> {
    const key = `${this._cachePrefix}:${title}`
    const cached = await this.storage?.cacheGet(key);
    if(cached) {
      return cached.value as ResourceInfo
    }
    const prompt = await this.chatPrompt.formatMessages({ title });

    await this._ratelimitter();
    const r = await retry(async (b) => {
      console.info(`Extracting info from ${title}`);
      const r = await this.model.invoke(prompt);
      const result = JSON.parse(String(r.content));
      return result;
    }, { retries: 2 });
    await this.storage?.cacheSet(key, r);
    return r;
  }
}
