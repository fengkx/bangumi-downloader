import { PikPakClient } from "../../core/downloader/pikpak/pikpak.ts";
import { MikanAni } from "../../core/fetcher/mikanani/mikanani.ts";
import { GeminiExtractor } from "../../core/info-extractor/gemini/gemini.ts";
import { SQLiteStorage } from "../../db/storages/sqlite.ts";
import { App } from "../../app.ts";
import { load } from "https://deno.land/std@0.216.0/dotenv/mod.ts";
import { loadConfig } from "../../config/init-config.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
export async function main(options: { configFile: string }) {
  const env = await load({ export: true });

  try {
    const config = await loadConfig(options.configFile);
    console.log(config);
    const pikpak = new PikPakClient(
      Deno.env.get("PIKPAK_USER") ?? "",
      Deno.env.get("PIKPAK_PASSWORD") ?? "",
    );
    await pikpak.init();

    const mikan = new MikanAni();

    const storage = await SQLiteStorage.create();
    const gemini = new GeminiExtractor(Deno.env.get("GEMINI_API_KEY") ?? "");

    const app = new App(mikan, gemini, pikpak, storage, config);
    await app.run();

    console.log("RUN Finished");
  } catch (error) {
    console.error(error);
  }
}
