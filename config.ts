import { defineConfig } from "./src/config/init-config.ts";

export default defineConfig({
  feedUrls: [
    "https://mikanani.me/RSS/Bangumi?bangumiId=3330&subgroupid=44",
  ],
  feed_concurrency: 4,
  job_concurrency: 8,
  prefer_subtitle_lang: ["zh-Hant", "zh-Hans", "ja"],
  baseFolder: "BANGUMI_test",
  notificationer: {
    type: "telegram",
    user_id: Deno.env.get("TELEGRAM_USERID") ?? "",
    token: Deno.env.get("TELEGRAM_TOKEN") ?? "",
  },
});
