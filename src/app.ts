import { Sema } from "npm:async-sema";
import retry from "https://esm.sh/async-retry@1.3.3";

import { Downloader } from "./downloader/downloader-type.ts";
import { Fetcher } from "./fetcher/fetcher-types.ts";
import { EpisodeWithRsourceInfo, Extractor } from "./info-extractor/common.ts";
import { Storeage } from "./db/kysely.ts";
export class App {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly infoExtractor: Extractor,
    private readonly downloader: Downloader,
    private readonly storage: Storeage
  ) {
  }

  async run(feedUrl: string) {
    const episodes = await this.fetcher.getEpisodes(feedUrl);
    const episodesWithInfo: EpisodeWithRsourceInfo[] = await Promise.all(
      episodes.map(async (ep) => {
        const info = await this.infoExtractor.getInfoFromTitle(ep.title);
        return { ...ep, extractedInfo: info };
      }),
    );

    const sema = new Sema(4, { capacity: episodes.length });
    await Promise.all(
      this.filterLatestVersionAndHigherResoultion(episodesWithInfo).map(
        async (ep) => {
          await sema.acquire();
          await this.doOneWithRetry(ep);
          sema.release();
        },
      ),
    );
  }

  private filterLatestVersionAndHigherResoultion(
    episodes: EpisodeWithRsourceInfo[],
  ) {
    const map = new Map<string, EpisodeWithRsourceInfo>();
    episodes.forEach((ep) => {
      const key = this.infoExtractor.getId(ep);
      const existed = map.get(key);``
      if (!existed) {
        map.set(key, ep);
      } else {
        if (ep.extractedInfo.version === "final") {
          map.set(key, ep);
        }
        if (
          typeof existed.extractedInfo.version === "string" &&
          typeof ep.extractedInfo.version &&
          /^\d+$/.test(ep.extractedInfo.version) &&
          /^\d$/.test(existed.extractedInfo.version)
        ) {
          const newer = Number(ep.extractedInfo.version) >
            Number(existed.extractedInfo.version);
          if (newer) {
            map.set(key, ep);
          }
        }
      }
    });

    return Array.from(map.values());
  }

  async doOne(episode: EpisodeWithRsourceInfo) {
    console.info(`Downloading ${episode.title}`);
    
    const folderName = this.infoExtractor.makeFolderName(episode);
    const {id, name} = await this.downloader.downLoadToPath(episode.torrent.url, folderName);
    // await this.storage.
    
  }

  async doOneWithRetry(episode: EpisodeWithRsourceInfo) {
    return await retry(async () => {
      return await this.doOne(episode);
    }, {
      retries: 2,
      onRetry(e, attempt) {
        console.info(
          `[Retries: ${attempt}] Downloading ${episode.title} Cause: ${e.message}`,
        );
      },
    });
  }
}
