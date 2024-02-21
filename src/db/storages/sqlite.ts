import { Except } from "npm:type-fest";

import { db, MediaItem, migrateToLatest, StorageRepo } from "../kysely.ts";
import type { Cache } from "../db-types.ts";

export class SQLiteStorage implements StorageRepo {
  static async create() {
    await migrateToLatest();
    return new SQLiteStorage();
  }

  async cacheSet<T>(k: string, value: T) {
    const r = await db.insertInto("_cache").values({
      key: k,
      value: JSON.stringify(value),
    }).returningAll()
      .onConflict((ocb) => {
        return ocb.column("key").doUpdateSet({ value: JSON.stringify(value) });
      })
      .execute();
    return r[0];
  }
  async cacheGet<T>(k: string) {
    const r = await db.selectFrom("_cache").where("key", "=", k).selectAll()
      .executeTakeFirst();
    if (r) {
      r.value = JSON.parse(r.value);
      return r as Except<Cache, "value"> & { value: T };
    }
    return undefined;
  }
  async getMediaItemById(id: string): Promise<MediaItem | undefined> {
    return await db.selectFrom("medias").where("id", "=", id).selectAll().limit(
      1,
    ).executeTakeFirst();
  }

  async setMediaItemById(id: string, m: MediaItem): Promise<void> {
    const existed = await this.getMediaItemById(id);
    if (!existed) {
      await db.insertInto("medias").values({
        id,
        name: m.name,
        file_id: m.file_id,
        raw_title: m.raw_title,
      }).execute();
    } else {
      await db.updateTable("medias").where("id", "=", id).set({
        name: m.name,
        file_id: m.file_id,
        raw_title: m.raw_title,
      }).execute();
    }
  }
}
