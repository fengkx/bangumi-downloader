import { PikPakClient } from "./downloader/pikpak/pikpak.ts";
import { MikanAni } from "./fetcher/mikanani/mikanani.ts";
import { GeminiExtractor } from "./info-extractor/gemini/gemini.ts";
import { SQLiteStorage } from "./db/storages/sqlite.ts";
import { App } from "./app.ts";
import { load } from "https://deno.land/std@0.216.0/dotenv/mod.ts";
import { parseArgs } from "https://deno.land/std@0.216.0/cli/parse_args.ts";
import { resolve as pathResolve } from "https://deno.land/std@0.216.0/path/resolve.ts";
import { loadConfig } from "./config/init-config.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const env = await load();
  const args = parseArgs(Deno.args);

  try {
    let configFile = args.config;
    if (!configFile) {
      throw new Error("Usage: --config xx.config.ts");
    }
    configFile = pathResolve(configFile);
    const config = await loadConfig(configFile);
    console.log(config);
    const pikpak = new PikPakClient(
      env.PIKPAK_USER,
      env.PIKPAK_PASSWORD,
    );
    await pikpak.init();

    const mikan = new MikanAni();

    const storage = await SQLiteStorage.create();
    const gemini = new GeminiExtractor(env.GEMINI_API_KEY);

    const app = new App(mikan, gemini, pikpak, storage, config);
    await app.run();

    console.log("RUN Finished");
  } catch (error) {
    console.error(error);
  }
}
