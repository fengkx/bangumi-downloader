import { PikPakClient } from "../../core/downloader/pikpak/pikpak.ts";
import { MikanAni } from "../../core/fetcher/mikanani/mikanani.ts";
import { GeminiExtractor } from "../../core/info-extractor/gemini/gemini.ts";
import { SQLiteStorage } from "../../db/storages/sqlite.ts";
import { App } from "../../app.ts";
import { load } from "https://deno.land/std@0.216.0/dotenv/mod.ts";
import { loadConfig } from "../../config/init-config.ts";
import { TelegramNotifier } from "../../core/notifier/telegram.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
export async function main(options: { configFile: string }) {
  await load({ export: true });

  try {
    const config = await loadConfig(options.configFile);
    console.log(config);
    const pikpak = new PikPakClient(
      Deno.env.get("PIKPAK_USER") ?? "",
      Deno.env.get("PIKPAK_PASSWORD") ?? "",
    );
    await pikpak.init();

    const mikan = new MikanAni(config);

    const storage = await SQLiteStorage.create();
    const gemini = new GeminiExtractor(Deno.env.get("GEMINI_API_KEY") ?? "");
    let telegramBot = undefined;
    if (config.notifier.type === "telegram" && config.notifier.token) {
      telegramBot = new TelegramNotifier(config);
    }

    const app = new App(mikan, gemini, pikpak, storage, config, telegramBot);
    await app.run();

    console.log("RUN Finished");
  } catch (error) {
    console.error(error);
  }
}
