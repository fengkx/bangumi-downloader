import { ResourceInfo } from "./common.ts";

export class BaseExtractor {
    makeFolderName(info: ResourceInfo): string {
        return info.cn_title
    }
    makeFileName(info: ResourceInfo): string {
        return `${info.cn_title}_${info.title}_${info.episode_number}`
    }
}