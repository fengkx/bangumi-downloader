export type EpisodeInfo = {
  guid: string;
  title: string;
  detailLink?: string;
  torrent: {
    url: string;
  };
};

export interface Fetcher {
  getEpisodes(feedUrl: string): Promise<EpisodeInfo[]>;
}
