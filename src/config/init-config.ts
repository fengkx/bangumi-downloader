import { defu } from "npm:defu";
import type { ReadonlyDeep, RequiredDeep } from "npm:type-fest";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";

const configValidator = z.object({
  feedUrls: z.array(z.string().url()),
  feed_concurrency: z.number().min(1),
  job_concurrency: z.number().min(1),
  baseFolder: z.string().optional(),
  prefer_subtitle_lang: z.array(z.enum(["zh-Hans", "zh-Hant", "ja"])).default([
    "zh-Hans",
    "zh-Hant",
    "ja",
  ]),
});

type ConfigFileType = z.infer<typeof configValidator>;
export type BangumiDownloaderConfig = ReadonlyDeep<
  RequiredDeep<ConfigFileType>
>;

export function defineConfig<T extends ConfigFileType>(
  config: T,
): ReadonlyDeep<RequiredDeep<T>> {
  return defu(config, { baseFolder: "" }) as ReadonlyDeep<RequiredDeep<T>>;
}

export async function loadConfig(
  absPath: string,
): Promise<BangumiDownloaderConfig> {
  if (!existsSync(absPath)) {
    throw new Error(`${absPath} not existed`);
  }
  const { default: config } = await import(absPath);
  return defineConfig(configValidator.parse(config));
}
