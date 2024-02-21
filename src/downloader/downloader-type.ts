export interface Downloader {
  init(): Promise<void>;
  downLoadToPath(
    resourceUrl: string,
    folder: string,
    fileName?: string,
  ): Promise<{ id: string; name: string }>;

  isFileExist(id: string): Promise<boolean>;
}
