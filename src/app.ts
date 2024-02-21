import { join as pathJoin } from "https://deno.land/std@0.216.0/path/join.ts";
import { Sema } from "npm:async-sema";
import retry from "https://esm.sh/async-retry@1.3.3";
import { dequal } from "npm:dequal";
import { Downloader } from "./core/downloader/downloader-type.ts";
import { Fetcher } from "./core/fetcher/fetcher-types.ts";
import {
  EpisodeWithRsourceInfo,
  Extractor,
} from "./core/info-extractor/common.ts";
import { StorageRepo } from "./db/kysely.ts";
import { BangumiDownloaderConfig } from "./config/init-config.ts";
import { arrayEqualIgnoredOrder } from "./utils.ts";

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
    const feedUrls = Array.from(new Set(this.config.feedUrls));
    const sema = new Sema(this.config.feed_concurrency, {
      capacity: feedUrls.length,
    });

    const usedIds = new Set<string>();
    await Promise.all(feedUrls.map(async (feedUrl) => {
      await sema.acquire();
      const ids = await this.runFeed(feedUrl);
      ids.forEach((id) => usedIds.add(id));
      sema.release();
    }));

    const mediasToDelete = await this.storage.getMediaItemsNotInIds(
      Array.from(usedIds),
    );
    if (mediasToDelete.length > 0) {
      console.info(`Delete unused medias ${mediasToDelete.length}`);
      await this.downloader.deleteFile(mediasToDelete.map((m) => m.file_id));
      await this.storage.removeMediaItemById(mediasToDelete.map((m) => m.id));
    }
  }
  async runFeed(feedUrl: string): Promise<string[]> {
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
      this.pickBestItem(episodesWithInfo).map(
        async (ep) => {
          await sema.acquire();
          await this.doOneWithRetry(ep);
          sema.release();
        },
      ),
    );
    return episodesWithInfo.map((e) => this.infoExtractor.getId(e));
  }

  private pickBestItem(
    episodes: EpisodeWithRsourceInfo[],
  ) {
    const map = new Map<string, EpisodeWithRsourceInfo>();
    episodes.forEach((ep) => {
      const key = this.infoExtractor.getId(ep);
      const existed = map.get(key);

      if (!existed) {
        map.set(key, ep);
      } else {
        if (
          !dequal(ep.extractedInfo.resolution, existed.extractedInfo.resolution)
        ) {
          // pick largest resolution
          const currentWidth = ep.extractedInfo.resolution?.height ?? 0;
          const existedWidth = existed.extractedInfo.resolution?.height ?? 0;

          if (
            typeof currentWidth === "number" &&
            typeof existedWidth === "number" &&
            currentWidth > existedWidth
          ) {
            console.info(
              `Pick ${ep.title} over ${existed.title} Reason: resolution ${ep.extractedInfo.resolution?.height} > ${existed.extractedInfo.resolution?.height}`,
            );
            map.set(key, ep);
          }
        } else if (ep.extractedInfo.version !== existed.extractedInfo.version) {
          // version is different
          if (
            ep.extractedInfo.version === "final"
          ) {
            // take final version
            console.info(
              `Pick ${ep.title} over ${existed.title} Reason: version`,
            );
            map.set(key, ep);
          }

          if (
            typeof existed.extractedInfo.version === "string" &&
            typeof ep.extractedInfo.version &&
            /^\d+$/.test(ep.extractedInfo.version) &&
            /^\d$/.test(existed.extractedInfo.version)
          ) {
            // take version bigger version
            const newer = Number(ep.extractedInfo.version) >
              Number(existed.extractedInfo.version);
            if (newer) {
              console.info(
                `Pick ${ep.title} over ${existed.title} Reason version`,
              );
              map.set(key, ep);
            }
          }
        } else if (
          (Array.isArray(ep.extractedInfo.subtitle_lang) &&
            Array.isArray(existed.extractedInfo.subtitle_lang)) &&
          !arrayEqualIgnoredOrder(
            ep.extractedInfo.subtitle_lang,
            existed.extractedInfo.subtitle_lang,
          )
        ) {
          // subtitle lang is different
          const existedLangIndex = this.findSubtitleLangIndex(
            existed.extractedInfo.subtitle_lang,
          );
          const currentLangIndex = this.findSubtitleLangIndex(
            ep.extractedInfo.subtitle_lang,
          );
          if (
            currentLangIndex < existedLangIndex &&
            currentLangIndex > -1 &&
            currentLangIndex < this.config.prefer_subtitle_lang.length // make sure currentIndex is valid
          ) {
            console.info(
              `Pick ${ep.title} over ${existed.title} Reason: subtitle lang ${ep.extractedInfo.subtitle_lang}`,
            );
            map.set(key, ep);
          }
        }
      }
    });

    return Array.from(map.values());
  }

  private findSubtitleLangIndex(subtitle_lang: string[]) {
    let index = -1;
    for (let i = 0; i < subtitle_lang.length; i++) {
      const idx = this.config.prefer_subtitle_lang.indexOf(subtitle_lang[i]);
      if (idx >= 0 && (idx < index || index === -1)) {
        index = idx;
      }
    }

    return index;
  }

  private async downloadEpisode(episode: EpisodeWithRsourceInfo) {
    const id = this.infoExtractor.getId(episode);
    const folderName = this.infoExtractor.makeFolderName(episode);
    const folderPath = pathJoin(this.config.baseFolder, folderName);
    console.info(`Downloading ${episode.title}`);
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

  async doOne(episode: EpisodeWithRsourceInfo) {
    const id = this.infoExtractor.getId(episode);
    const media = await this.storage.getMediaItemById(id);
    if (media && await this.downloader.isFileExist(media.file_id)) {
      if (media.raw_title === episode.title) {
        console.log(`Already existed Skip downoading ${media.file_name}`);
      } else {
        await this.downloader.deleteFile([media.file_id]);
        await this.downloadEpisode(episode);
      }
    } else {
      await this.downloadEpisode(episode);
    }
  }

  async doOneWithRetry(episode: EpisodeWithRsourceInfo) {
    return await retry(async () => {
      return await this.doOne(episode);
    }, {
      retries: 2,
      onRetry(e, attempt) {
        console.info(
          `[Retries: ${attempt}] Retry episode ${episode.title} Cause: ${e.message}`,
        );
      },
    });
  }
}
