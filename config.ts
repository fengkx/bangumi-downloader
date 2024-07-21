import { defineConfig } from "./src/config/init-config.ts";

export default defineConfig({
  feedUrls: [
    "https://mikanani.me/RSS/Bangumi?bangumiId=3240&subgroupid=203",
    "https://mikanani.me/RSS/Bangumi?bangumiId=3141&subgroupid=583",
    "https://mikanani.me/RSS/Bangumi?bangumiId=3215&subgroupid=34",
    "https://mikanani.me/RSS/Bangumi?bangumiId=1505&subgroupid=422",
    "https://mikanani.me/RSS/Bangumi?bangumiId=3330&subgroupid=44",
    "https://mikanani.me/RSS/Bangumi?bangumiId=3341&subgroupid=370",
    "https://mikanani.me/RSS/Bangumi?bangumiId=3373&subgroupid=583",
  ],
  feed_concurrency: 4,
  job_concurrency: 8,
  prefer_subtitle_lang: ["zh-Hant", "zh-Hans", "ja"],
  baseFolder: "BANGUMI",
  notifier: {
    type: "telegram",
    user_id: Deno.env.get("TELEGRAM_USERID") ?? "",
    token: Deno.env.get("TELEGRAM_TOKEN") ?? "",
  },
});
