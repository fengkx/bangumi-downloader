import { Sema } from "npm:async-sema";
import { Downloader } from "./downloader/downloader-type.ts";
import { EpisodeInfo, Fetcher } from "./fetcher/fetcher-types.ts";
import { Extractor } from "./info-extractor/common.ts";

export class App {
    constructor(private readonly fetcher: Fetcher, private readonly  infoExtractor: Extractor, private readonly  downloader: Downloader) {
    }

    async run(feedUrl: string) {
        const episodes = await this.fetcher.getEpisodes(feedUrl);
        const sema = new Sema(4, {capacity: episodes.length})
        await Promise.all(episodes.map(async ep => {
            await sema.acquire();
            await this.doOne(ep);
            sema.release()
        }))
        

    }
    async doOne(episode: EpisodeInfo) {
        const info = await this.infoExtractor.getInfoFromTitle(episode.title);
        console.info(`Downloading ${info.cn_title ?? info.title} ${info.episode_number} ${info.resolution.width}x${info.resolution.height}`)
        const folderName = this.infoExtractor.makeFolderName(info);
        await this.downloader.downLoadToPath(episode.torrent.url, folderName)
    }
}