import { join as pathJoin } from "https://deno.land/std@0.216.0/path/join.ts";
import { Sema } from "npm:async-sema";
import retry from "https://esm.sh/async-retry@1.3.3";

import { Downloader } from "./downloader/downloader-type.ts";
import { Fetcher } from "./fetcher/fetcher-types.ts";
import { EpisodeWithRsourceInfo, Extractor } from "./info-extractor/common.ts";
import { StorageRepo } from "./db/kysely.ts";
import { BangumiDownloaderConfig } from "./config/init-config.ts";

export class App {
  constructor(
    private readonly fetcher: Fetcher,
    private readonly infoExtractor: Extractor,
    private readonly downloader: Downloader,
    private readonly storage: StorageRepo,
    private readonly config: BangumiDownloaderConfig,
  ) {
  }

  async run() {
    const feedUrls = this.config.feedUrls;
    const sema = new Sema(this.config.feed_concurrency, {
      capacity: feedUrls.length,
    });
    await Promise.all(feedUrls.map(async (feedUrl) => {
      await sema.acquire();
      await this.runFeed(feedUrl);
      sema.release();
    }));
  }
  async runFeed(feedUrl: string) {
    const episodes = await this.fetcher.getEpisodes(feedUrl);
    const episodesWithInfo: EpisodeWithRsourceInfo[] = await Promise.all(
      episodes.map(async (ep) => {
        const info = await this.infoExtractor.getInfoFromTitle(ep.title);
        return { ...ep, extractedInfo: info };
      }),
    );

    const sema = new Sema(this.config.job_concurrency, {
      capacity: episodes.length,
    });
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
      const existed = map.get(key);

      if (!existed) {
        map.set(key, ep);
      } else {
        // take final version
        if (ep.extractedInfo.version === "final") {
          map.set(key, ep);
        }
        // take version bigger version
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
    const folderName = this.infoExtractor.makeFolderName(episode);
    const id = this.infoExtractor.getId(episode);
    const media = await this.storage.getMediaItemById(id);
    if (media && await this.downloader.isFileExist(media.file_id)) {
      // get resoultion or other...
      console.log(`Already existed Skip downoading ${media.file_name}`);
    } else {
      console.info(`Downloading ${episode.title}`);
      const folderPath = pathJoin(this.config.baseFolder, folderName);
      const { id: file_id, name } = await this.downloader.downLoadToPath(
        episode.torrent.url,
        folderPath,
      );
      await this.storage.setMediaItemById(id, {
        file_id,
        file_name: name,
        folder_name: folderPath,
        raw_title: episode.title,
      });
    }
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
