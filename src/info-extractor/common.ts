type Resolution = {
  width: number;
  height: number;
};

type SubtitleKind = "srt" | "ass" | "embedding" | 'unknown';

export type ResourceInfo = {
  cn_title: string;
  title: string;
  subtitle_source: string;
  episode_number: number | string | null;
  container_format: string;
  subtitle_lang: string[];
  resolution: Resolution;
  subtitle_kind: SubtitleKind;
};

export interface Extractor {
  getInfoFromTitle(title: string): Promise<ResourceInfo>;
  makeFolderName(info: ResourceInfo): string;
  makeFileName(info: ResourceInfo): string;
}
