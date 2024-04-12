import { load } from "https://deno.land/std@0.216.0/dotenv/mod.ts";
import { FakeDownloader } from "./core/downloader/faker.ts";
import { MikanAni } from "./core/fetcher/mikanani/mikanani.ts";
import { defineConfig, loadConfig } from "./config/init-config.ts";
import { GeminiExtractor } from "./core/info-extractor/gemini/gemini.ts";
import { SQLiteStorage } from "./db/storages/sqlite.ts";
import { fromFileUrl } from "https://deno.land/std@0.222.1/path/from_file_url.ts";
import { ConsoleNotifier } from "./core/notifier/console.ts";
import { App } from "./app.ts";
import { FakerExtractor } from "./core/info-extractor/faker.ts";

async function main() {
  await load({ export: true });
  let storage: SQLiteStorage | undefined;

  try {
    const config = defineConfig({
        feedUrls: [
          "https://mikanani.me/RSS/Bangumi?bangumiId=3240&subgroupid=12",
          "https://mikanani.me/RSS/Bangumi?bangumiId=3141&subgroupid=583",
          "https://mikanani.me/RSS/Bangumi?bangumiId=3215&subgroupid=34",
          "https://mikanani.me/RSS/Bangumi?bangumiId=1505&subgroupid=422",
          "https://mikanani.me/RSS/Bangumi?bangumiId=3330&subgroupid=44",
          "https://mikanani.me/RSS/Bangumi?bangumiId=3341&subgroupid=370",
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
      
    const downloader = new FakeDownloader();
    await downloader.init();

    // @ts-expect-error for tests
    const mikan = new MikanAni(config);

    const testPath = fromFileUrl(
      new URL("../tests/fixtures/db_main_test.sqlite3", import.meta.url),
    );
    storage = await SQLiteStorage.create(testPath);
    const gemini = new FakerExtractor();
    let telegramBot = undefined;
    telegramBot = new ConsoleNotifier();

    const app = new App(
      mikan,
      gemini,
      downloader,
      storage,
      // @ts-expect-error for tests
      config,
      telegramBot,
    );
    await app.run();

    console.log("RUN Finished");
  } catch (error) {
    console.error(error);
  } finally {
    await storage?.close()
  }
}


Deno.test('test main', main)