export interface Downloader {
  init(): Promise<void>;
  downLoadToPath(
    resourceUrl: string,
    folder: string,
    fileName?: string,
  ): Promise<{ id: string; name: string; mediaUrl?: string }>;

  isFileExist(id: string): Promise<boolean>;
  deleteFile(ids: string[]): Promise<void>;

  // mkdirp(p: string): Promise<{id: string}>
  removeDirIfEmpty(p: string): Promise<boolean>;
}
