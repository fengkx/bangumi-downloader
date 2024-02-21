import { defineConfig } from "./src/config/init-config.ts";

export default defineConfig({
  feedUrls: [
    // "https://mikanani.me/RSgaS/Bangumi?bangumiId=3141&subgroupid=583",
    "https://mikanani.me/RSS/Bangumi?bangumiId=3240&subgroupid=12",
  ],
  feed_concurrency: 4,
  job_concurrency: 8,
  prefer_subtitle_lang: ["zh-Hant", "zh-Hans", "ja"],
  baseFolder: "BANGUMI",
});
