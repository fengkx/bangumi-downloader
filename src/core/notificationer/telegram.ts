import TelegramBot from "https://esm.sh/node-telegram-bot-api@0.65.1";
import { Notificationer } from "./base.ts";
import { BangumiDownloaderConfig } from "../../config/init-config.ts";

export class TelegramNotificationer extends TelegramBot implements Notificationer {
    constructor(private readonly config: BangumiDownloaderConfig) {
        super(config.botToken);
    }
    async sendNotification(markdownText: string): Promise<void> {
        await this.sendMessage(this.config.notificationer.user_id, markdownText, {parse_mode: 'MarkdownV2'})
    }
}