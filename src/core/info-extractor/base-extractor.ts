import { EpisodeWithRsourceInfo } from "./common.ts";
import { simplecc } from "npm:simplecc-wasm";

export class BaseExtractor {
  makeFolderName(ep: EpisodeWithRsourceInfo): string {
    return simplecc(ep.extractedInfo.cn_title, "t2s");
  }
  makeFileName(ep: EpisodeWithRsourceInfo): string {
    const { episode_number } = ep.extractedInfo;
    if (typeof episode_number === "string" && /^\d+$/.test(episode_number)) {
      return `${episode_number}_${ep.title}.${ep.extractedInfo.container_format}`;
    }
    return "";
  }

  getId(ep: EpisodeWithRsourceInfo): string {
    return `${
      simplecc(ep.extractedInfo.cn_title ?? ep.extractedInfo.title, "t2s")
    }_${ep.extractedInfo.episode_number}`;
  }
}
