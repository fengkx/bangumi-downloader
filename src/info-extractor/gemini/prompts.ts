import { ResourceInfo } from "../common.ts";

export const examples: Array<{input: string; output: ResourceInfo}> = [{
  "input":
    "[ANi] Sōsō no Frieren / 葬送的芙莉莲 - 23 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]",
    "output": {
      version: '1',
        "cn_title": "葬送的芙莉莲",
        "title": "Sōsō no Frieren",
        "subtitle_source": "ANi",
        "episode_number": 23,
        "container_format": "mp4",
        "subtitle_lang": ["zh-Hant"],
        "resolution": { "width": 1920, "height": 1080 },
        "subtitle_kind": "embedding",
      },
}, {
  "input":
    "[ANi] Sōsō no Frieren / 葬送的芙莉莲 - 22 [1080P][Baha][WEB-DL][AAC AVC][CHT][MP4]",
    "output": {
      version: '1',
        "cn_title": "葬送的芙莉莲",
        "title": "Sōsō no Frieren",
        "subtitle_source": "ANi",
        "episode_number": 22,
        "container_format": "mp4",
        "subtitle_lang": ["zh-Hant"],
        "resolution": { "width": 1920, "height": 1080 },
        "subtitle_kind": "embedding",
      },
}, {
  "input": "[GJ.Y] 海贼王 / One Piece - 1094 (B-Global 3840x2160 HEVC AAC MKV)",
  
    "output": {
      version: '1',
      "cn_title": "海贼王",
      "title": "One Piece",
      "subtitle_source": "GJ.Y",
      "episode_number": 1094,
      "container_format": "mkv",
      "subtitle_lang": ["unknown"],
      "subtitle_kind": "embedding",
      "resolution": { "width": 3840, "height": 2160 },
    
}, 
}, {
  "input":
    "[OPFans枫雪动漫][ONE PIECE 海贼王][第1092话][1080P][MP4][典藏版][简体]",
    "output": {
        "cn_title": "海贼王",
        "title": "ONE PIECE",
        "subtitle_kind": "embedding",
        "subtitle_source": "OPFans枫雪动漫",
        "episode_number": 1092,
        "container_format": "mp4",
        version: '1',
        "subtitle_lang": ["zh-Hans"],
        "resolution": { "width": 1920, "height": 1080 },
      },
}, {
  "input":
    "【喵萌奶茶屋】★01月新番★[福星小子 2022年版 / Urusei Yatsura 2022][27][1080p][繁日双语][招募翻译]",
    "output": {
        "cn_title": "福星小子",
        "title": "Urusei Yatsura",version: '1',
        "subtitle_source": "萌奶茶屋",
        "episode_number": 27,
        "container_format": "mp4",
        "subtitle_lang": ["zh-Hant", "ja"],
        "resolution": { "width": 1920, "height": 1080 },
        "subtitle_kind": "embedding",
      },
}, {
  "input":
    "[豌豆字幕组&LoliHouse] 进击的巨人 / Shingeki no Kyojin - 86 [WebRip 1080p HEVC-10bit AAC][简繁内封字幕]（下周停播）",
    "output": {
        "cn_title": "进击的巨人",
        "title": "Shingeki no Kyojin",
        version: '1',
        "subtitle_source": "豌豆字幕组&LoliHouse",
        "episode_number": 86,
        "container_format": "mp4",
        "subtitle_lang": ["zh-Hans", "zh-Hant"],
        "subtitle_kind": "embedding",
        "resolution": { "width": 1920, "height": 1080 },
      },
}, {
    "input":
    "【极影字幕社】 ★10月新番 【进击的巨人 最终季】【Shingeki no Kyojin The Final Season】【28】BIG5 MP4_720",
  "output": {
    "cn_title": "进击的巨人最终季",
    "title": "Shingeki no Kyojin The Final Season",
    "subtitle_source": "极影字幕社",
    "episode_number": 28,
    subtitle_kind: 'embedding',
    version: '1',
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hant"],
    "resolution": { "width": 1280, "height": 720 },
  },
}, {
    "input":
    "[orion origin发布组] 进击的巨人（最终季 part.2）Shingeki no Kyojin (The Final Season) [82] [1080p] [GB] [mkv] [网盘] [2022年1月番] [复制磁连]",
  "output": {
    "cn_title": "进击的巨人（最终季part.2）",
    "title": "Shingeki no Kyojin (The Final Season)",
    "subtitle_source": "orion origin发布组",
    "episode_number": 82,
    "container_format": "mkv",
    "subtitle_lang": ["zh-Hans"],
    "subtitle_kind": "embedding",
    version: '1',
    "resolution": { "width": 1920, "height": 1080 },
  },
}, {
    "input":
    "[Skymoon-Raws] 进击的巨人 第四季 / Shingeki no Kyojin - The Final Season - 21 [ViuTV][WEB-DL][1080p][AVC AAC][繁体外挂][MP4+ASSx2]",
  "output": {
    "cn_title": "进击的巨人",
    "title": "Shingeki no Kyojin",
    "subtitle_source": "Skymoon-Raws",
    version: '1',
    "episode_number": 21,
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hant"],
    "resolution": { "width": 1920, "height": 1080 },
    "subtitle_kind": "ass",
  },
}, {
    "input":
    "[❀拨雪寻春❀] 进击的巨人 The Final Season 完结篇(后篇) / Shingeki no Kyojin：The Final Season - Kanketsu-hen [WEBRip][AVC-8bit 1080p][繁日内嵌]",
  "output": {
    "cn_title": "进击的巨人最终季完结篇（后篇）",
    "title": "Shingeki no Kyojin：The Final Season - Kanketsu-hen",
    "subtitle_source": "拨雪寻春",
    version: '1',
    "subtitle_kind": "embedding",
    episode_number: null,
    "subtitle_lang": ["zh-Hant", "ja"],
    "resolution": { "width": 1920, "height": 1080 },
    "container_format": "mkv",
  },
}, {
    "input":
    "[c.c动漫][1月新番][再得一胜!][01-13][合集][BIG5][1080P][MP4] [2.4GB] [复制磁连]",
  "output": {
    "cn_title": "再得一胜！",
    version: '1',
    "title": "",
    "subtitle_source": "c.c动漫",
    "episode_number": "01-13",
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hant"],
    "subtitle_kind": "unknown",
    "resolution": { "width": 1920, "height": 1080 },
  },
}, {
    "input":
    "[LoliHouse] 剧场版 弦音 -起始的一箭- / Tsurune Hajimari no Issha The Movie [BDRip 1080p HEVC-10bit FLAC][简繁内封字幕] [8.35 GB] [复制磁连]",
  "output": {
    "cn_title": "剧场版 弦音 -起始的一箭-",
    "title": "Tsurune Hajimari no Issha The Movie",
    "subtitle_source": "LoliHouse",
    "episode_number": null,
    "container_format": "mp4",
    version: '1',
    "subtitle_lang": ["zh-Hans", "zh-Hant"],
    "resolution": { "width": 1920, "height": 1080 },
    "subtitle_kind": "embedding",
  },
}, {
    "input":
    "【喵萌Production】[Love Live! Superstar!! / ラブライブ！スーパースター!!][01-12][BDRip][1080p][繁日双语][招募翻译] [7.5GB] [复制磁连]",
  "output": {
    "cn_title": "Love Live! Superstar!!",
    "title": "Love Live! Superstar!!",
    version: '1',
    "subtitle_source": "喵萌Production",
    "episode_number": "01-12",
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hant", "ja"],
    "resolution": { "width": 1920, "height": 1080 },
    "subtitle_kind": "embedding",
  },
}, {
    "input":
    "[云光字幕组]剧场版 紫罗兰永恒花园 Violet Evergarden the Movie [简体双语][4K SDR]招募时轴翻译 [3.4GB]",
  "output": {
    "cn_title": "剧场版 紫罗兰永恒花园",
    "title": "Violet Evergarden the Movie",
    "subtitle_source": "云光字幕组",
    "episode_number": null,
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hans", "ja"],
    version: '1',
    "resolution": { "width": 3840, "height": 2160 },
    "subtitle_kind": "embedding",
  },
}, {
    "input":
    "【幻之字幕组】剧场版 紫罗兰永恒花园[Violet Evergarden the Movie] [1080P][GB][BDrip] [2.5GB]",
  "output": {
    "cn_title": "剧场版 紫罗兰永恒花园",
    "title": "Violet Evergarden the Movie",
    "subtitle_source": "幻之字幕组",
    version: '1',
    "episode_number": null,
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hans"],
    "resolution": { "width": 1920, "height": 1080 },
    "subtitle_kind": "embedding",
  },
}, {
    "input":
    "[Skymoon-Raws] 无职转生，到了异世界就拿出真本事 / Mushoku Tensei - 23 [ViuTV][WEB-DL][1080p][AVC AAC][繁体外挂][MP4+ASS](正式版本) [294.1MB]",
  "output": {
    version: 'final',
    "cn_title": "无职转生，到了异世界就拿出真本事",
    "title": "Mushoku Tensei",
    "subtitle_source": "Skymoon-Raws",
    "episode_number": 23,
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hant"],
    "resolution": { "width": 1920, "height": 1080 },
    "subtitle_kind": "ass",
  },
}, {
    "input":
    "【澄空学园&动漫国字幕组】★年末特番[魔法科高中的劣等生 追忆篇][1080P][简体][MP4][v2] [1.2 GB]",
  "output": {
    "version": '2',
    "cn_title": "魔法科高中的劣等生 追忆篇",
    "title": '',
    "subtitle_source": "澄空学园&动漫国字幕组",
    "episode_number": 1,
    "container_format": "mp4",
    subtitle_kind: 'unknown',
    "subtitle_lang": ["zh-Hans"],
    "resolution": { "width": 1920, "height": 1080 },
  },
}, {
    "input":
    "[雷电字幕组]我的青春恋爱物语果然有问题（完）Yahari Ore no Seishun Lovecome wa Machigatte Iru. Kan【07】【简中】【1080P】 [292.1 MB]",
  "output": {
    version: '1',
    "cn_title": "我的青春恋爱物语果然有问题（完）",
    "title": "Yahari Ore no Seishun Lovecome wa Machigatte Iru. Kan",
    "subtitle_source": "雷电字幕组",
    "episode_number": 7,
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hans"],
    "resolution": { "width": 1920, "height": 1080 },
    "subtitle_kind": "embedding",
  },
}, {
    "input":
    "【动漫国&KNA&轻之国度字幕组】[Re:从零开始的异世界生活][OVA][02][冰冻的情谊][BDRip][HEVC_FLAC][1080P_Ma10P][简繁外挂] [4.4GB] [复制磁连]",
  "output": {
    "cn_title": "Re:从零开始的异世界生活 OVA",
    "title": '',
    subtitle_kind: 'ass',
    "subtitle_source": "动漫国&KNA&轻之国度字幕组",
    "episode_number": 2,
    version: '1',
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hans", "zh-Hant"],
    "resolution": { "width": 1920, "height": 1080 },
  },
}, {
    "input":
    "【幻樱字幕组】【我们无法一起学习/我们真的学不来 Bokutachi wa Benkyou ga Dekinai】【OVA】【01~02】【BIG5_MP4】【1920X1080】【合集】 [657.1MB]",
  "output": {
    "cn_title": "我们无法一起学习 OVA",
    subtitle_kind: 'unknown',
    "title": "Bokutachi wa Benkyou ga Dekinai OVA",
    "subtitle_source": "幻樱字幕组",
    "episode_number": "01~02",
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hant"],
    version: '1',
    "resolution": { "width": 1920, "height": 1080 },
  },
}, {
    "input":
    "【DHR动研字幕组&茉语星梦】[ReLIFE 重返17岁 完结篇_ReLIFE][14-17完][BDRip][繁体][720P][MP4] [554.6MB] [复制磁连]",
  "output": {
    "cn_title": "ReLIFE 重返17岁完结篇",
    "title": "ReLIFE",
    subtitle_kind: 'unknown',
    "subtitle_source": "DHR动研字幕组&茉语星梦",
    version: '1',
    "episode_number": "14-17",
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hant"],
    "resolution": { "width": 1280, "height": 720 },
  },
}, {
    "input":
    "[jibaketa合成&音频压制][TVB粤语]多啦A梦大电影: 大雄与翼之勇者 / 电影哆啦A梦：大雄与翼之勇者 / Nobita to Tsubasa no Yuushatachi [粤语+内封繁体中文字幕][WEB 1920x1080 AVC AAC SRT TVB CAN CHT] [复制磁连]",
  "output": {
    "cn_title": "多啦A梦大电影: 大雄与翼之勇者",
    "title": "Nobita to Tsubasa no Yuushatachi",
    "subtitle_source": "jibaketa合成&音频压制",
    version: '1',
    "episode_number": null,
    "container_format": "mp4",
    "subtitle_lang": ["zh-Hant"],
    "resolution": { "width": 1920, "height": 1080 },
    "subtitle_kind": "srt",
  },
}, {
  "input":
    "[豌豆字幕组&LoliHouse] 青之驱魔师 岛根启明结社篇 / Ao no Exorcist Shimane Illuminati-hen - 07 [WebRip 1080p HEVC-10bit AAC][简繁外挂字幕] [复制磁连]",
    "output": {
        subtitle_kind: 'ass',
        "cn_title": "青之驱魔师 岛根启明结社篇",
        "title": "Ao no Exorcist Shimane Illuminati-hen",
        version: '1',
        "subtitle_source": "豆字幕组&LoliHouse",
        "episode_number": 7,
        "container_format": "mp4",
        "subtitle_lang": ["zh-Hans", "zh-Hant"],
        "resolution": { "width": 1920, "height": 1080 },
      },
}];
