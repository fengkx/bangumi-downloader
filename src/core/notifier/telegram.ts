import TelegramBot from "https://esm.sh/node-telegram-bot-api@0.65.1";
import { Notifier } from "./base.ts";
import { BangumiDownloaderConfig } from "../../config/init-config.ts";

export class TelegramNotifier extends TelegramBot implements Notifier {
  constructor(private readonly config: BangumiDownloaderConfig) {
    super(config.notifier.token);
  }
  async sendNotification(text: string, mediaUrl?: string): Promise<void> {
    // // if (mediaUrl) {
    // //   try {
    // //     const resp = await fetch(mediaUrl);
    // //     const buf = await resp.arrayBuffer();
    // //     console.log(buf)
    // //     await this.sendVideo(this.config.notifier.user_id, buf, {caption: text, parse_mode: 'HTML'}, {contentType: 'video/mp4'})
    // //   } catch (_error) {
    // //     // console.error(_error);
    // //     await this.sendMessage(this.config.notifier.user_id, text, {
    // //       parse_mode: "HTML",
    // //     });
    // //   }
    // } else {
    await this.sendMessage(this.config.notifier.user_id, text, {
      parse_mode: "HTML",
    });
    // }
  }
}
