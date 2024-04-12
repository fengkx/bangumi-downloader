import { Except } from "npm:type-fest";
import {stringify} from "npm:safe-stable-stringify";

import { getDb, MediaItem, migrateToLatest, StorageRepo } from "../kysely.ts";
import type { Cache } from "../db-types.ts";

export class SQLiteStorage implements StorageRepo {
  constructor(private readonly dbPath?: string) {}
  static async create(dbPath: string) {
    await migrateToLatest(dbPath);
    return new SQLiteStorage(dbPath);
  }

  async cacheSet<T>(k: string, value: T) {
    const db = getDb(this.dbPath);
    const r = await db.insertInto("_cache").values({
      key: k,
      value: stringify(value) ?? '',
    }).returningAll()
      .onConflict((ocb) => {
        return ocb.column("key").doUpdateSet({ value: stringify(value) });
      })
      .execute();
    return r[0];
  }
  async cacheGet<T>(k: string) {
    const db = getDb(this.dbPath);
    const r = await db.selectFrom("_cache").where("key", "=", k).selectAll()
      .executeTakeFirst();
    if (r) {
      // @ts-expect-error force to parse json
      r.value = JSON.parse(r.value);
      return r as Except<Cache, "value"> & { value: T };
    }
    return undefined;
  }
  async getMediaItemById(id: string): Promise<MediaItem | undefined> {
    const db = getDb(this.dbPath);
    return await db.selectFrom("medias").where("id", "=", id).selectAll().limit(
      1,
    ).executeTakeFirst();
  }

  async setMediaItemById(id: string, m: MediaItem): Promise<void> {
    const db = getDb(this.dbPath);
    const existed = await this.getMediaItemById(id);
    if (!existed) {
      await db.insertInto("medias").values({
        id,
        file_name: m.file_name,
        folder_name: m.folder_name,
        file_id: m.file_id,
        raw_title: m.raw_title,
      }).execute();
    } else {
      await db.updateTable("medias").where("id", "=", id).set({
        folder_name: m.folder_name,
        file_name: m.file_name,
        file_id: m.file_id,
        raw_title: m.raw_title,
      }).execute();
    }
  }
  async removeMediaItemById(ids: string[]): Promise<void> {
    const db = getDb(this.dbPath);
    await db.deleteFrom("medias").where("id", "in", ids).execute();
  }

  async getMediaItemsNotInIds(ids: string[]): Promise<MediaItem[]> {
    const db = getDb(this.dbPath);
    const rows = await db.selectFrom("medias").where("id", "not in", ids)
      .selectAll().execute();
    return rows;
  }

  async findMediaByRawTitle(raw_title: string): Promise<MediaItem| undefined> {
    const db = getDb(this.dbPath);
    return await db.selectFrom("medias").where("raw_title", "=", raw_title).selectAll().limit(
      1,
    ).executeTakeFirst();
  }
}
