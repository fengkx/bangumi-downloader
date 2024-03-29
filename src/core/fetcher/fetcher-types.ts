import type { BangumiDownloaderConfig } from "../../config/init-config.ts";

export type EpisodeInfo = {
  guid: string;
  title: string;
  detailLink?: string;
  torrent: {
    url: string;
  };
  bangumiSubjectId?: number;
};

export interface Fetcher {
  getEpisodes(feedUrl: string): Promise<EpisodeInfo[]>;
}
