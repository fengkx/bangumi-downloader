import { EpisodeInfo } from "../fetcher/fetcher-types.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

type Resolution = {
  width: number;
  height: number;
};

type SubtitleKind = "srt" | "ass" | "embedding" | "unknown";

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

export const resourceInfoValidator = z.object({
  // Loosen some check
  version: z.string().default("v1"),
  cn_title: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  subtitle_source: z.string(),
  episode_number: z.string().or(z.number()).or(z.null()),
  resolution: z.object({ width: z.number(), height: z.number() }).optional()
    .nullable(),
  subtitle_kind: z.string().optional().nullable(),
});

export type EpisodeWithRsourceInfo = EpisodeInfo & {
  extractedInfo: ResourceInfo;
};

export interface Extractor {
  getInfoFromTitle(title: string): Promise<ResourceInfo>;
  makeFolderName(info: EpisodeWithRsourceInfo): string;
  makeFileName(info: EpisodeWithRsourceInfo): string;
  getId(ep: EpisodeWithRsourceInfo): string;
}
