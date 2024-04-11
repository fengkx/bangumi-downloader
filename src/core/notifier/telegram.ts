import TelegramBot from "https://esm.sh/node-telegram-bot-api@0.65.1";
import { Notifier } from "./base.ts";
import { BangumiDownloaderConfig } from "../../config/init-config.ts";

export class TelegramNotifier extends TelegramBot implements Notifier {
  constructor(private readonly config: BangumiDownloaderConfig) {
    super(config.notifier.token);
  }
  async sendNotification(text: string): Promise<void> {
    await this.sendMessage(this.config.notifier.user_id, text, {
      parse_mode: "html",
    });
  }
}
