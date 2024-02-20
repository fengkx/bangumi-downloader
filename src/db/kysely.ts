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
import { Database, Cache } from "./types.ts";
import { Except } from "npm:type-fest";

export type Db = Kysely<Database>;

const db = new Kysely<Database>({
  dialect: new DenoSqliteDialect({
    database: new DB(fromFileUrl(new URL('../../data/db.sqlite3', import.meta.url))),
  }),
});

async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider(
      new URL("migrations/", import.meta.url),
    ),
  });

  const migrations = await migrator.getMigrations();
  await migrator.migrateToLatest();
}
await migrateToLatest();


export class SQLiteStorage implements Storeage {
    
    static async create() {
        await migrateToLatest();
        return new SQLiteStorage()
    }

    async cacheSet<T>(k: string, value: T) {
        const r = await db.insertInto('_cache').values({key: k, value: JSON.stringify(value)}).returningAll()
        .onConflict(ocb => {
            // await db.updateTable('_cache').where('key', '=', k).set('value', JSON.stringify(value))
return            ocb.column('key').doUpdateSet({value: JSON.stringify(value)})
        })
        .execute();
        return r[0];
    }
    async cacheGet<T>(k: string) {
        const r =  await db.selectFrom('_cache').where('key', '=', k).selectAll().execute();
        
        if(r.length > 0) {
            r[0].value = JSON.parse(r[0].value);
            return r[0] as Except<Cache, 'value'> & {value: T} ;
        }
    }
}

export interface Storeage {
    cacheSet(k: string, value: unknown): Promise<Cache>
    cacheGet<T = any>(k: string): Promise<Except<Cache, 'value'> & {value: T} | undefined>
}

