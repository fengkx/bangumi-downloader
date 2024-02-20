export interface Downloader {
  downLoadToPath(
    resourceUrl: string,
    folder: string,
    fileName?: string,
  ): Promise<void>;
}
