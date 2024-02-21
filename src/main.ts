import { PikPakClient } from "./downloader/pikpak/pikpak.ts";
import { MikanAni } from "./fetcher/mikanani/mikanani.ts";
import { GeminiExtractor } from "./info-extractor/gemini/gemini.ts";
import { SQLiteStorage } from "./db/storages/sqlite.ts";
import { App } from "./app.ts";
import { load } from "https://deno.land/std@0.216.0/dotenv/mod.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const env = await load();
  Object.keys(env).forEach((k) => {
    Deno.env.set(k, env[k]);
  });
  const pikpak = new PikPakClient(
    env.PIKPAK_USER,
    env.PIKPAK_PASSWORD,
  );
  await pikpak.login();

  const feedUrl =
    "https://mikanani.me/RSS/Bangumi?bangumiId=3141&subgroupid=583";
  const mikan = new MikanAni();
  // const episodes = await mikan.getEpisodes(feedUrl);
  // console.log(episodes)
  const storage = await SQLiteStorage.create();
  const gemini = new GeminiExtractor(env.GEMINI_API_KEY);
  // console.log(await gemini.getInfoFromTitle('[ANi] Sōsō no Frieren /  葬送的芙莉莲 - 15 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]'))

  const app = new App(mikan, gemini, pikpak, storage);
  await app.run(feedUrl);
  console.log("RUN Finished");
  } catch (error) {
    console.error(error);
  }
}
