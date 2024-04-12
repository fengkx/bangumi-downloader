import { fromFileUrl } from "https://deno.land/std@0.216.0/path/from_file_url.ts";

import { Kysely, Migrator } from "npm:kysely";
import {
  DenoSqliteDialect,
  FileMigrationProvider,
} from "./kysely_deno_sqlite/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { Cache, Database } from "./db-types.ts";
import { Except } from "npm:type-fest";
import { MediaRow } from "./db-types.ts";

export type Db = Kysely<Database>;

let db: Db;
export const getDb = (path?: string) => {
  if (db) {
    return db;
  }
  db = new Kysely<Database>({
    dialect: new DenoSqliteDialect({
      database: new DB(
        path ?? fromFileUrl(new URL("../../data/db.sqlite3", import.meta.url)),
      ),
    }),
  });
  return db;
};

export async function migrateToLatest(dbPath?: string) {
  const migrator = new Migrator({
    db: getDb(dbPath),
    provider: new FileMigrationProvider(
      new URL("migrations/", import.meta.url),
    ),
  });

  // const migrations = await migrator.getMigrations();
  await migrator.migrateToLatest();
}

export interface StorageRepo {
  cacheSet(k: string, value: unknown): Promise<Cache>;
  // deno-lint-ignore no-explicit-any
  cacheGet<T = any>(
    k: string,
  ): Promise<Except<Cache, "value"> & { value: T } | undefined>;

  getMediaItemById(id: string): Promise<MediaItem | undefined>;
  setMediaItemById(
    id: string,
    m: Except<MediaItem, "id" | "created_at">,
  ): Promise<void>;

  getMediaItemsNotInIds(ids: string[]): Promise<MediaItem[]>;
  findMediaByRawTitle(title: string): Promise<MediaItem | undefined>;

  removeMediaItemById(ids: string[]): Promise<void>;
}

export type MediaItem = MediaRow;
