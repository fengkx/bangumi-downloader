import type { EpisodeInfo, Fetcher } from "../fetcher-types.ts";
import { parseFeed } from "../rss.ts";

export class MikanAni implements Fetcher {
    async getEpisodes(feedUrl: string) {
        const feed = await parseFeed(feedUrl);
        
        const episode: EpisodeInfo[] = feed.entries.map(entry => {
            return {
                guid: entry.id,
                title: entry.title?.value!,
                // @ts-expect-error mikan have torrent field
                detailLink: entry.torrent?.link?.value,
                torrent: {
                    url: entry.attachments?.find(item => item.mimeType === 'application/x-bittorrent')?.url!
                }
            }
        })
        return episode;
    }
}