import type { Downloader } from "./downloader-type.ts";

const createIdGenerator = (init: number = 0) => {
  let i = init;
  return () => {
    i += 1;
    return i;
  };
};

const idGen = createIdGenerator(0);

export class FakeDownloader implements Downloader {
  private readonly fs = new Map<string, { id: string; name: string }>();
  constructor() {
  }
  get getFsJson() {
    return [...this.fs.entries()];
  }
  init(): Promise<void> {
    return Promise.resolve();
  }
  downLoadToPath(
    resourceUrl: string,
    folder: string,
    fileName?: string | undefined,
  ): Promise<{ id: string; name: string; mediaUrl?: string | undefined }> {
    const name = `${folder}/${fileName ?? "fake name"}`;
    const id = idGen().toString();
    const f = { name, id, mediaUrl: resourceUrl };
    this.fs.set(id, f);
    return Promise.resolve(f);
  }
  isFileExist(id: string): Promise<boolean> {
    return Promise.resolve(this.fs.has(id));
  }
  deleteFile(ids: string[]): Promise<void> {
    ids.forEach((id) => {
      this.fs.delete(id);
    });
    return Promise.resolve();
  }
  removeDirIfEmpty(_p: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
