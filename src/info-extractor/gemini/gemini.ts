import {
  AIMessagePromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "npm:@langchain/core/prompts";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "npm:@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "npm:@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "npm:@google/generative-ai";

import { Extractor } from "../common.ts";

export class GeminiExtractor implements Extractor {
  readonly model: ChatGoogleGenerativeAI;
  chatPrompt: ChatPromptTemplate<any, any>;
  constructor(API_KEY: string) {
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

    const humanTemplate = "input: {text}";
    const aiTemplate = "output: {text}";

    const chatPrompt = ChatPromptTemplate.fromMessages([
      ["human", humanTemplate],
      ["ai", aiTemplate],
    ]);
    this.chatPrompt = chatPrompt;
  }
   async createPrompt() {
    // Format the messages
    const formattedChatPrompt = await this.chatPrompt.formatMessages({
      text: '123'
    });

    console.log(formattedChatPrompt);
  }

  async getInfoFromTitle(title: string) {
  }
}
