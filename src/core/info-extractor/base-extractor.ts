import { EpisodeWithRsourceInfo } from "./common.ts";
import { simplecc } from "npm:simplecc-wasm";
import { getSubjectById } from "./utils/bangumi-api.ts";

export class BaseExtractor {
  async makeFolderName(ep: EpisodeWithRsourceInfo): Promise<string> {
    console.log(ep.bangumiSubjectId);
    if (ep.bangumiSubjectId) {
      const bgmSubject = await getSubjectById(ep.bangumiSubjectId);
      console.log(bgmSubject.name_cn);
      return simplecc(bgmSubject.name_cn, "t2s");
    }
    return simplecc(ep.extractedInfo.cn_title, "t2s");
  }
  async makeFileName(ep: EpisodeWithRsourceInfo): Promise<string> {
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
