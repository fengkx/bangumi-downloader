import ky from "npm:ky";
import { decode } from "https://esm.sh/he@1.2.0";
import type { EpisodeInfo, Fetcher } from "../fetcher-types.ts";
import { parseFeed } from "../rss.ts";
import { BangumiDownloaderConfig } from "../../../config/init-config.ts";

export class MikanAni implements Fetcher {
  constructor(private readonly config: BangumiDownloaderConfig) {}

  async getEpisodes(feedUrl: string) {
    let subjectId: number | undefined = undefined;
    const feed = await parseFeed(feedUrl);
    try {
      const mikanId = new URL(feedUrl).searchParams.get("bangumiId");
      let html = await ky.get(`Home/Bangumi/${mikanId}`, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          accept: "text/html",
        },
        prefixUrl: this.config.mikanBaseUrl,
      }).text();
      html = decode(html);

      subjectId = Number(html.match(/bgm\.tv\/subject\/(\d+)/)?.[1]);
    } catch (error) {
      console.info(`Failed to get bgm.tv subject id ${error.message}`);
    }
    const episode: EpisodeInfo[] = feed.entries.map((entry) => {
      // @ts-expect-error mikan have torrent field
      const torrent = entry.torrent;
      return {
        guid: entry.id,
        title: entry.title?.value!,

        detailLink: torrent?.link?.value,
        torrent: {
          url: entry.attachments?.find((item) =>
            item.mimeType === "application/x-bittorrent"
          )?.url!,
          pubDate: torrent?.pubDate.value,
        },
        bangumiSubjectId: subjectId,
      };
    });
    return episode;
  }
}
