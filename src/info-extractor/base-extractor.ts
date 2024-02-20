import { EpisodeWithRsourceInfo } from "./common.ts";

export class BaseExtractor {
    makeFolderName(ep: EpisodeWithRsourceInfo): string {
        return ep.extractedInfo.cn_title
    }
    makeFileName(ep: EpisodeWithRsourceInfo): string {
        const {episode_number} =  ep.extractedInfo;
        if(typeof episode_number === 'string' && /^\d+$/.test(episode_number)) {
            return `${episode_number}_${ep.title}.${ep.extractedInfo.container_format}`
        }
        return ''
    }
}