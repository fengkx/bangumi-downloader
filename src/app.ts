import { Downloader } from "./downloader/downloader-type.ts";
import { EpisodeInfo, Fetcher } from "./fetcher/fetcher-types.ts";
import { Extractor } from "./info-extractor/common.ts";

export class App {
    constructor(private readonly fetcher: Fetcher, private readonly  infoExtractor: Extractor, private readonly  downloader: Downloader) {

    }

    async run(feedUrl: string) {
        const episodes = await this.fetcher.getEpisodes(feedUrl);
        this.doOne(episodes[0]);
        this.doOne(episodes[1]);
        

    }
    async doOne(episode: EpisodeInfo) {
        const info = await this.infoExtractor.getInfoFromTitle(episode.title);
        const folderName = this.infoExtractor.makeFolderName(info);
        await this.downloader.downLoadToPath(episode.torrent.url, folderName)
    }
}