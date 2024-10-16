import * as posixPath from "https://deno.land/std@0.216.0/path/posix/mod.ts";
import * as crypto from "https://deno.land/std@0.177.0/node/crypto.ts";
import ky, { BeforeRequestHook } from "npm:ky";
import wait from "npm:async-wait-until";
import { Sema } from "npm:async-sema";
import { defu } from "npm:defu";
import {
  PikPakAbout,
  PikpakFile,
  PikpakFileList,
  PikpakFolder,
  PikpakRequestListFiles,
  RequestOfflineDownload,
} from "./pikpak-types.ts";
import { Downloader } from "../downloader-type.ts";
import { RequestCreateFolder } from "./pikpak-types.ts";
import type { Except } from "npm:type-fest";
import { PikPakErrorResponse } from "./errors.ts";
import { PikpakError } from "./errors.ts";
import { PikpakDownloadTask, PikpakRequestListTasks } from "./pikpak-types.ts";
import { PikpakTaskList } from "./pikpak-types.ts";

export class PikPakClient implements Downloader {
  private clientId: string;
  private clientSecret: string;
  private package_name: string;
  private client_version: string;
  private algoObjects = [
    "PAe56I7WZ6FCSkFy77A96jHWcQA27ui80Qy4",
    "SUbmk67TfdToBAEe2cZyP8vYVeN",
    "1y3yFSZVWiGN95fw/2FQlRuH/Oy6WnO",
    "8amLtHJpGzHPz4m9hGz7r+i+8dqQiAk",
    "tmIEq5yl2g/XWwM3sKZkY4SbL8YUezrvxPksNabUJ",
    "4QvudeJwgJuSf/qb9/wjC21L5aib",
    "D1RJd+FZ+LBbt+dAmaIyYrT9gxJm0BB",
    "1If",
    "iGZr/SJPUFRkwvC174eelKy",
  ];
  private pikpakDriveHost: string;
  private username: string;
  private password: string;
  private access_token: string;
  private refresh_token: string;
  private sub: string;
  private deviceId: string;
  public readonly client: typeof ky;
  private readonly pikpakUserHost: string;
  private captcha_token: string;

  private readonly _lock = new Map<string, Sema>();

  constructor(username: string, password: string) {
    this.clientId = "YNxT9w7GMdWvEOKa";
    this.clientSecret = "dbw2OtmVEeuUvIptb1Coyg";
    this.pikpakUserHost = "https://user.mypikpak.com";
    this.pikpakDriveHost = "https://api-drive.mypikpak.com" as const;
    this.package_name = "com.pikcloud.pikpak";
    this.captcha_token = "";
    this.client_version = "1.46.2";

    this.username = username;
    this.password = password;
    this.access_token = "";
    this.refresh_token = "";
    this.sub = "";
    this.deviceId = crypto.createHash("md5").update(username + password).digest(
      "hex",
    ) as string;
    this.client = ky.create({
      fetch: fetch,
      hooks: {
        beforeRequest: [
          async (request) => {
            // request.headers.set(
            //   "User-Agent",
            //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            // );
            const url = new URL(request.url);
            if (
              url.pathname.startsWith("/drive/v1")
            ) {
              await this.getcaptcha_token("POST:" + url.pathname);
            }
            this.deviceId && request.headers.set("x-device-id", this.deviceId);
            this.captcha_token &&
              request.headers.set("x-captcha-token", this.captcha_token);
            this.access_token &&
              request.headers.set(
                "Authorization",
                `Bearer ${this.access_token}`,
              );
          },
        ] as BeforeRequestHook[],
        beforeError: [
          async (httpErr) => {
            const { response } = httpErr;
            if (response && response.body) {
              const errorResponse = await response
                .json() as PikPakErrorResponse;
              const error = new PikpakError(httpErr, errorResponse);
              return error;
            }
            return httpErr;
          },
        ],
      },
    });
  }

  async init(): Promise<void> {
    return await this.login();
  }

  async login() {
    const url = `${this.pikpakUserHost}/v1/auth/signin`;

    const meta: Record<string, string> = {};
    if (this.username.includes("@")) {
      meta["email"] = this.username;
    } else if (/\d{10}/.test(this.username)) {
      meta["phone_number"] = this.username;
    } else {
      meta["username"] = this.username;
    }
    const captcha_token = await this.getcaptcha_token(`POST:${url}`, meta);
    const req = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username: this.username,
      password: this.password,
      captcha_token,
    };

    try {
      const resp = await this.client.post(
        url,
        {
          json: req,
        },
        // deno-lint-ignore no-explicit-any
      ).json() as any;

      if (!resp.access_token) {
        throw new Error("Login failed");
      }

      this.access_token = resp.access_token;
      this.refresh_token = resp.refresh_token;
      this.sub = resp.sub;
    } catch (error) {
      throw new Error("Login failed", { cause: error });
    }
  }

  async logout() {
    const req = {
      token: this.access_token,
    };

    try {
      await this.client.post(`${this.pikpakUserHost}/v1/auth/revoke`, {
        json: req,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Logout failed", { cause: error });
    }
  }

  async getcaptcha_token(action: string, inputMeta?: Record<string, string>) {
    const ts = `${Date.now()}`;
    let sign = this.clientId + this.client_version + this.package_name +
      this.deviceId + ts;

    for (const algo of this.algoObjects) {
      sign = crypto.createHash("md5").update(sign + algo).digest(
        "hex",
      ) as string;
    }

    sign = "1." + sign;

    const meta: Record<string, string> = inputMeta ?? {
      captcha_sign: sign,
      client_version: this.client_version,
      package_name: this.package_name,
      timestamp: ts,
      user_id: this.sub,
    };

    const req = {
      action: action,
      clientId: this.clientId,
      deviceID: this.deviceId,
      meta,
      redirect_uri: "https://api.mypikpak.com/v1/auth/callback",
    };

    try {
      const resp = await this.client.post(
        `${this.pikpakUserHost}/v1/shield/captcha/init`,
        {
          json: req,
        },
      ).json() as { captcha_token: string };

      this.captcha_token = resp.captcha_token;
    } catch (error) {
      throw new Error("Failed to obtain captcha token", { cause: error });
    }
  }
  async listFiles(inParams?: PikpakRequestListFiles): Promise<PikpakFileList> {
    const defaultParams: PikpakRequestListFiles = {
      "thumbnail_size": "SIZE_MEDIUM",
      with_audit: true,
      filters: {
        "trashed": { "eq": false },
      },
    };

    if (inParams?.filters?.phase === undefined) {
      defaultParams.filters!.phase = { "eq": "PHASE_TYPE_COMPLETE" };
    }
    const params: PikpakRequestListFiles = defu(inParams, defaultParams);
    const resp = await this.client.get(
      `${this.pikpakDriveHost}/drive/v1/files`,
      { searchParams: { ...params, filters: JSON.stringify(params.filters) } },
    );
    const json = await resp.json();
    return json as PikpakFileList;
  }

  async getTask(
    taskId: string,
  ): Promise<PikpakDownloadTask["task"] | undefined> {
    const url = `${this.pikpakDriveHost}/drive/v1/tasks/${taskId}`;
    const resp = await this.client.get(url);
    const json = await resp.json() as PikpakDownloadTask["task"];
    return json;
  }

  async listTask(
    inParams?: PikpakRequestListTasks,
  ): Promise<PikpakTaskList> {
    const params: PikpakRequestListTasks = defu(inParams, {
      filters: {
        phase: {
          in: ["PHASE_TYPE_COMPLETE", "PHASE_TYPE_RUNNING", "PHASE_TYPE_ERROR"]
            .join(","),
        },
      },
    });
    const resp = await this.client.get(
      `${this.pikpakDriveHost}/drive/v1/tasks`,
      { searchParams: { ...params, filters: JSON.stringify(params.filters) } },
    );
    const json = await resp.json();
    return json as PikpakTaskList;
  }

  private getLock(key: string) {
    let lock = this._lock.get(key);
    if (!lock) {
      lock = new Sema(1, { capacity: 1000 });
      this._lock.set(key, lock);
    }
    return lock!;
  }

  async createFolder(inParams: Except<RequestCreateFolder, "kind">) {
    const key = `createFolder:${inParams.name}:${inParams.parent_id}`;

    const lock = this.getLock(key);
    await lock.acquire();
    const resp = await this.client.post(
      `${this.pikpakDriveHost}/drive/v1/files`,
      {
        json: defu(inParams ?? {}, { kind: "drive#folder" }),
      },
    );

    const json = await resp.json() as { file: PikpakFolder };
    lock.release();
    return json.file;
  }
  async getFileInfo(id: string): Promise<PikpakFile> {
    const url = `${this.pikpakDriveHost}/drive/v1/files/${id}`;
    const resp = await this.client.get(url);
    const json = await resp.json() as PikpakFile;
    return json;
  }

  async isFileExist(id: string): Promise<boolean> {
    try {
      await this.getFileInfo(id);
      return true;
    } catch (_error) {
      return false;
    }
  }

  async getDownloadUrl(id: string): Promise<string> {
    const file = await this.getFileInfo(id);
    return file.web_content_link;
  }

  async getQuotaInfo(): Promise<PikPakAbout> {
    const url = `${this.pikpakDriveHost}/drive/v1/about`;
    const resp = await this.client.get(url);
    const r = await resp.json();
    return r as PikPakAbout;
  }

  async mkdirp(p: string, create?: true): Promise<PikpakFolder>;
  async mkdirp(p: string, create?: false): Promise<PikpakFolder | undefined>;
  async mkdirp(p: string, create = true): Promise<PikpakFolder | undefined> {
    const lock = this.getLock(`mkdirp:${p}`);
    try {
      await lock.acquire();
      p = posixPath.normalize(p).replace(/^\//g, "");
      const segments = p.split(posixPath.SEPARATOR);

      let i = 0;
      let parent = "";
      let folder;
      while (i < segments.length) {
        const folderList = await this.listFiles({
          parent_id: parent,
          filters: { kind: { eq: "drive#folder" }, phase: null },
        });

        folder = folderList.files.find((folder) => folder.name === segments[i]);

        if (!folder) {
          break;
        }

        i++;
        parent = folder.id;
      }
      if (i === segments.length && folder) {
        return folder as PikpakFolder;
      }

      if (!create) {
        return undefined;
      }

      for (; i < segments.length; i++) {
        folder = await this.createFolder({
          name: segments[i],
          parent_id: parent,
        });
        parent = folder.id;
      }
      return folder! as PikpakFolder;
    } catch (error) {
      lock.release();

      throw error;
    } finally {
      lock.release();
    }
  }

  async getEntryByPath(
    p: string,
  ): Promise<PikpakFile | PikpakFolder | undefined> {
    p = posixPath.normalize(p).replace(/^\//g, "");
    const segments = p.split(posixPath.SEPARATOR);

    let i = 0;
    let parent = "";
    let entry;
    while (i < segments.length) {
      const entires = await this.listFiles({
        parent_id: parent,
      });
      entry = entires.files.find((folder) => folder.name === segments[i]);
      if (!entry) {
        return;
      }

      parent = entry.id;
      i++;
    }
    if (entry && i === segments.length) {
      return entry;
    }
  }

  async offlineDownload(
    inParams: Except<
      RequestOfflineDownload,
      "kind" | "upload_type" | "folder_type"
    >,
  ): Promise<PikpakDownloadTask> {
    const params: RequestOfflineDownload = defu(inParams, {
      kind: "drive#file" as const,
      upload_type: "UPLOAD_TYPE_URL" as const,
      folder_type: inParams.parent_id ? "" : "DOWNLOAD",
    });
    const resp = await this.client.post(
      `${this.pikpakDriveHost}/drive/v1/files`,
      { json: params },
    );
    const json = await resp.json();
    return json as PikpakDownloadTask;
  }

  async downLoadToPath(
    resourceUrl: string,
    folderPath: string,
    fileName = "",
  ) {
    const folder = await this.mkdirp(folderPath);
    const res = await this.offlineDownload({
      url: { url: resourceUrl },
      parent_id: folder.id,
      name: fileName,
    });
    let mediaUrl = undefined;
    let file_id = undefined;
    try {
      await wait.waitUntil(
        async () => {
          try {
            const task = await this.getTask(res.task.id);
            if (task?.phase === "PHASE_TYPE_COMPLETE") {
              file_id = task.file_id;
              mediaUrl = await this.getDownloadUrl(file_id);
              return file_id;
            }
            return false;
          } catch (_error) {
            return undefined;
          }
        },
        { timeout: 3 * 60 * 1000, intervalBetweenAttempts: 5 * 1000 },
      );
    } catch (error) {
      console.error(
        `Failed to complete download task for ${res.task.file_name} Cause: ${error.message}`,
      );
    }
    return {
      id: file_id || res.task.file_id,
      name: res.task.file_name,
      mediaUrl,
    };
  }
  async deleteToTrash(ids: string[]) {
    const url = `${this.pikpakDriveHost}/drive/v1/files:batchTrash`;
    const resp = await this.client.post(url, { json: { ids } });
    return await resp.json();
  }
  async deleteFile(ids: string[]): Promise<void> {
    await this.deleteToTrash(ids);
  }

  async removeDirIfEmpty(p: string): Promise<boolean> {
    const folder = await this.mkdirp(p, false);
    if (!folder) {
      return false;
    }
    const list = await this.listFiles({ parent_id: folder.id });
    const r = list.files.length === 0;
    if (!r) {
      return false;
    }
    await this.deleteFile([folder.id]);
    return true;
  }

  // deno-lint-ignore no-explicit-any
  static isPikaFile(obj: any): obj is PikpakFile {
    const isObj = Object.prototype.toString.call(obj) === "[object Object]";
    return isObj && obj.kind === "drive#file";
  }
  // deno-lint-ignore no-explicit-any
  static isPikaFolder(obj: any): obj is PikpakFolder {
    const isObj = Object.prototype.toString.call(obj) === "[object Object]";
    return isObj && obj.kind === "drive#folder";
  }
}
