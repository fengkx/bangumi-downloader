import { fromFileUrl } from "https://deno.land/std@0.216.0/path/from_file_url.ts";

import {
  ColumnType,
  Generated,
  Insertable,
  Kysely,
  Migrator,
  Selectable,
  sql,
  Updateable,
} from "npm:kysely";
import {
  DenoSqliteDialect,
  FileMigrationProvider,
} from "./kysely_deno_sqlite/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";
import { Cache, Database } from "./db-types.ts";
import { Except } from "npm:type-fest";

export type Db = Kysely<Database>;

export const db = new Kysely<Database>({
  dialect: new DenoSqliteDialect({
    database: new DB(
      fromFileUrl(new URL("../../data/db.sqlite3", import.meta.url)),
    ),
  }),
});

export async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider(
      new URL("migrations/", import.meta.url),
    ),
  });

  // const migrations = await migrator.getMigrations();
  await migrator.migrateToLatest();
}
await migrateToLatest();

export interface StorageRepo {
  cacheSet(k: string, value: unknown): Promise<Cache>;
  cacheGet<T = any>(
    k: string,
  ): Promise<Except<Cache, "value"> & { value: T } | undefined>;

  getMediaItemById(id: string): Promise<MediaItem | undefined>;
  setMediaItemById(id: string, m: MediaItem): Promise<void>;
}

export type MediaItem = {
  name: string;
  file_id: string;
  raw_title: string;
};
