import { BaseExtractor } from "./base-extractor.ts";
import { Extractor, ResourceInfo } from "./common.ts";

export class FakerExtractor extends BaseExtractor implements Extractor {
  getInfoFromTitle(_title: string): Promise<ResourceInfo> {
    return Promise.resolve(
      {
        "cn_title": "狼与香辛料 行商邂逅贤狼",
        "container_format": "mp4",
        "episode_number": 1,
        "resolution": { "height": 1080, "width": 1920 },
        "subtitle_kind": "unknown",
        "subtitle_lang": ["zh-Hans"],
        "subtitle_source": "幻之字幕组",
        "title": "狼と香辛料 MERCHANT MEETS THE WISE WOLF",
        "version": "1",
      },
    );
  }
}
