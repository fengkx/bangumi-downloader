export interface Downloader {
  downLoadToPath(
    resourceUrl: string,
    folder: string,
    fileName?: string,
  ): Promise<{id: string; name:string}>;

  isFileExist(id: string): Promise<boolean>
}
