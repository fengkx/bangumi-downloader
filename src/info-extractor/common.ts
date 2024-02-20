import { EpisodeInfo } from "../fetcher/fetcher-types.ts";

type Resolution = {
  width: number;
  height: number;
};

type SubtitleKind = "srt" | "ass" | "embedding" | 'unknown';

export type ResourceInfo = {
  version: string;
  cn_title: string;
  title: string;
  subtitle_source: string;
  episode_number: number | string | null;
  container_format: string;
  subtitle_lang: string[];
  resolution: Resolution;
  subtitle_kind: SubtitleKind;
};

export type EpisodeWithRsourceInfo = EpisodeInfo & {extractedInfo: ResourceInfo}

export interface Extractor {
  getInfoFromTitle(title: string): Promise<ResourceInfo>;
  makeFolderName(info: EpisodeWithRsourceInfo): string;
  makeFileName(info: EpisodeWithRsourceInfo): string;
}
