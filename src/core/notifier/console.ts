import { Notifier } from "./base.ts";

export class ConsoleNotifier implements Notifier {
  // deno-lint-ignore require-await
  async sendNotification(
    text: string,
    mediaUrl?: string | undefined,
  ): Promise<void> {
    let messageText = text;
    if (mediaUrl) {
      messageText += `\nmedia: ${mediaUrl}`;
    }
    console.info(messageText);
  }
}
