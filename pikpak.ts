import ky, { BeforeRequestHook } from "https://esm.sh/ky";
import * as crypto from "https://deno.land/std@0.177.0/node/crypto.ts";
import { defu } from "npm:defu";
import { RequestListFiles } from "./pikpak-types.ts";
import { RequestCreateFolder } from "./pikpak-types.ts";
import type { SetOptional } from "npm:type-fest";
export class PikPakClient {
  clientId: string;
  clientSecret: string;
  package_name: string;
  client_version: string;
  algoObjects: readonly [
    { readonly alg: "md5"; readonly salt: "mg3UtlOJ5/6WjxHsGXtAthe" },
    { readonly alg: "md5"; readonly salt: "kRG2RIlL/eScz3oDbzeF1" },
    {
      readonly alg: "md5";
      readonly salt: "uOIOBDcR5QALlRUUK4JVoreEI0i3RG8ZiUf2hMOH";
    },
    { readonly alg: "md5"; readonly salt: "wa+0OkzHAzpyZ0S/JAnHmF2BlMR9Y" },
    { readonly alg: "md5"; readonly salt: "ZWV2OkSLoNkmbr58v0f6U3udtqUNP7XON" },
    {
      readonly alg: "md5";
      readonly salt: "Jg4cDxtvbmlakZIOpQN0oY1P0eYkA4xquMY9/xqwZE5sjrcHwufR";
    },
    { readonly alg: "md5"; readonly salt: "XHfs" },
    {
      readonly alg: "md5";
      readonly salt: "S4/mRgYpWyNGEUxVsYBw8n//zlywe5Ga1R8ffWJSOPZnMqWb4w";
    },
  ];
  pikpakDriveHost: string;
  username: string;
  password: string;
  access_token: string;
  refresh_token: string;
  sub: string;
  deviceId: string;
  client: typeof ky;
  pikpakUserHost: string;
  captcha_token: string;
  constructor(username: string, password: string) {
    this.clientId = "YUMx5nI8ZU8Ap8pm";
    this.clientSecret = "dbw2OtmVEeuUvIptb1Coygx";
    this.pikpakUserHost = "https://user.mypikpak.com";
    this.pikpakDriveHost = "https://api-drive.mypikpak.com";
    this.package_name = "mypikpak.com";
    this.captcha_token = "";
    this.client_version = "1.0.0";

    this.algoObjects = [{
      "alg": "md5",
      "salt": "mg3UtlOJ5/6WjxHsGXtAthe",
    }, {
      "alg": "md5",
      "salt": "kRG2RIlL/eScz3oDbzeF1",
    }, {
      "alg": "md5",
      "salt": "uOIOBDcR5QALlRUUK4JVoreEI0i3RG8ZiUf2hMOH",
    }, {
      "alg": "md5",
      "salt": "wa+0OkzHAzpyZ0S/JAnHmF2BlMR9Y",
    }, {
      "alg": "md5",
      "salt": "ZWV2OkSLoNkmbr58v0f6U3udtqUNP7XON",
    }, {
      "alg": "md5",
      "salt": "Jg4cDxtvbmlakZIOpQN0oY1P0eYkA4xquMY9/xqwZE5sjrcHwufR",
    }, {
      "alg": "md5",
      "salt": "XHfs",
    }, {
      "alg": "md5",
      "salt": "S4/mRgYpWyNGEUxVsYBw8n//zlywe5Ga1R8ffWJSOPZnMqWb4w",
    }] as const;
    this.username = username;
    this.password = password;
    this.access_token = "";
    this.refresh_token = "";
    this.sub = "";
    this.deviceId = crypto.createHash("md5").update(username).digest(
      "hex",
    ) as string;
    this.client = ky.create({
      fetch: fetch,
      hooks: {
        beforeRequest: [
          async (request) => {
            request.headers.set(
              "User-Agent",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
            );
            const url = new URL(request.url);
            if (
              request.method !== "GET" && url.pathname.startsWith("/drive/v1")
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
      },
    });
  }

  async login() {
    const req = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username: this.username,
      password: this.password,
    };

    try {
      const resp = await this.client.post(
        `${this.pikpakUserHost}/v1/auth/signin`,
        {
          json: req,
        },
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
      throw new Error("Logout failed");
    }
  }

  async getcaptcha_token(action: string) {
    const ts = `${Date.now()}`;
    let sign = this.clientId + this.client_version + this.package_name +
      this.deviceId + ts;

    for (const algo of this.algoObjects) {
      sign = crypto.createHash("md5").update(sign + algo.salt).digest(
        "hex",
      ) as string;
    }

    sign = "1." + sign;

    const req = {
      action: action,
      clientId: this.clientId,
      deviceID: this.deviceId,
      meta: {
        captcha_sign: sign,
        client_version: this.client_version,
        package_name: this.package_name,
        timestamp: ts,
        user_id: this.sub,
      },
      redirect_uri: "https://api.mypikpak.com/v1/auth/callback",
    };

    try {
      const resp = await this.client.post(
        `${this.pikpakUserHost}/v1/shield/captcha/init`,
        {
          json: req,
        },
      ).json() as any;

      this.captcha_token = resp.captcha_token;
    } catch (error) {
      throw new Error("Failed to obtain captcha token");
    }
  }
  async listFiles(inParams?: RequestListFiles) {
    const defaultParams: RequestListFiles = {
      filters: {
        "trashed": { "eq": false },
        "phase": { "eq": "PHASE_TYPE_COMPLETE" },
      },
      "thumbnail_size": "SIZE_MEDIUM",
      with_audit: true,
    };
    const params: RequestListFiles = defu(inParams, defaultParams);
    await this.getcaptcha_token("GET:/drive/v1/files/");
    const resp = await this.client.get(
      `${this.pikpakDriveHost}/drive/v1/files`,
      { searchParams: { ...params, filters: JSON.stringify(params.filters) } },
    );
    const json = await resp.json();
    return json;
  }

  createFolder(inParams: SetOptional<RequestCreateFolder, "kind">) {
    return this.client.post(`${this.pikpakDriveHost}/drive/v1/files`, {
      json: defu(inParams ?? {}, { kind: "drive#folder" }),
    });
  }
  async getDownloadUrl(id: string) {
    const url =
      `https://${self.PIKPAK_API_HOST}/drive/v1/files/{id}?usage=FETCH`;
    this.client.get(url);
  }
}
