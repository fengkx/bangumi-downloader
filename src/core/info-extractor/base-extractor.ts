import { EpisodeWithRsourceInfo } from "./common.ts";
import { simplecc } from "npm:simplecc-wasm";
import { getSubjectById } from "./utils/bangumi-api.ts";

export class BaseExtractor {
  async getSimpleCnTitle(ep: EpisodeWithRsourceInfo): Promise<string> {
    if (ep.bangumiSubjectId) {
      const bgmSubject = await getSubjectById(ep.bangumiSubjectId);
      return simplecc(bgmSubject.name_cn, "t2s");
    }
    return simplecc(ep.extractedInfo.cn_title, "t2s");
  }
  async makeFolderName(ep: EpisodeWithRsourceInfo): Promise<string> {
    return await this.getSimpleCnTitle(ep);
  }
  // deno-lint-ignore require-await
  async makeFileName(ep: EpisodeWithRsourceInfo): Promise<string> {
    const { episode_number } = ep.extractedInfo;
    if (typeof episode_number === "string" && /^\d+$/.test(episode_number)) {
      return `${episode_number}_${ep.title}.${ep.extractedInfo.container_format}`;
    }
    return "";
  }

  getId(ep: EpisodeWithRsourceInfo): string {
    const kvs = new Map<string, string>();

    const bgm_id = String(ep.bangumiSubjectId || "");
    kvs.set("bgm_id", bgm_id);
    if (!bgm_id) {
      kvs.set("cn_title", ep.extractedInfo.cn_title);
    }

    kvs.set("episode_number", String(ep.extractedInfo.episode_number || ""));
    const id = Array.from(kvs.entries()).filter(([_k, v]) => {
      return v.length > 0;
    }).sort((a, b) => {
      return a[0].charCodeAt(0) - b[0].charCodeAt(0);
    }).map(([k, v]) => {
      return `${k}:${v};`;
    }).join("$$");
    return id;
  }
}
