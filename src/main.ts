import { PikPakClient } from "./downloader/pikpak/pikpak.ts";
import { MikanAni } from "./fetcher/mikanani/mikanani.ts";
import { GeminiExtractor } from "./info-extractor/gemini/gemini.ts";
import { SQLiteStorage } from "./db/kysely.ts";
import { App } from "./app.ts";
import { load } from "https://deno.land/std@0.216.0/dotenv/mod.ts";

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const env = await load();
  Object.keys(env).forEach((k) => {
    Deno.env.set(k, env[k]);
  });
  console.log("Add 2 + 3 =", add(2, 3));
  const pikpak = new PikPakClient(
    env.PIKPAK_USER,
    env.PIKPAK_PASSWORD,
  );
  await pikpak.login();
  // const resp = await pikpak.listFiles();
  // console.log(resp);
  // await pikpak.createFolder({ name: "test API" });

  try {
    // const resp2 = await pikpak.getDownloadUrl('VNqyrRcBpHK9lEKmuzDRaoXYo1')
    // console.log(resp2);
    // console.log(await pikpak.getQuotaInfo())
    // console.log(await pikpak.mkdirp('///asad/baf/../sdc'));
    // const entry = await pikpak.getEntryByPath('///asad/baf/../sdc');
    // if(PikPakClient.isPikaFolder(entry)) {
    //   console.log(entry, 'getEntryByPath');

    // }
    // console.log(await pikpak.offlineDownload({url: {url: 'https://mikanani.me/Download/20240205/7cb5bd12bb2f7d8ef7ba0fd2be24d2b1ab3edc2a.torrent'}}))
    const feedUrl =
      "https://mikanani.me/RSS/Bangumi?bangumiId=3141&subgroupid=583";
    const mikan = new MikanAni();
    // const episodes = await mikan.getEpisodes(feedUrl);
    // console.log(episodes)
    const storage = await SQLiteStorage.create();
    const gemini = new GeminiExtractor(env.GEMINI_API_KEY, storage);
    // gemini.getInfoFromTitle('[ANi] Sōsō no Frieren / 葬送的芙莉莲 - 24 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]')

    const app = new App(mikan, gemini, pikpak, storage);
    await app.run(feedUrl);
    console.log("MAINEND");
  } catch (error) {
    console.error(error);
  }
}
