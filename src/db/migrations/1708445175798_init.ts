import { sql } from "npm:kysely";
import type { Db } from "../kysely.ts";

export async function up(db: Db) {
  await db.schema
    .createTable("person")
    .addColumn("id", "integer", (cb) => cb.primaryKey())
    .addColumn("first_name", "text", (cb) => cb.notNull())
    .addColumn("last_name", "text")
    .addColumn("gender", "text", (cb) => cb.notNull())
    .addColumn(
      "created_at",
      "timestamp",
      (cb) => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema.createTable("_cache").addColumn(
    "key",
    "text",
    (cb) => cb.unique(),
  ).addColumn("value", "json", (cb) => cb.notNull())
  .addColumn(
    "created_at",
    "timestamp",
    (cb) => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
  )
  .execute();

  await db.schema.createTable('medias')
  .addColumn('id', 'text', cb => cb.unique())
  .addColumn('file_id', 'text', cb => cb.notNull())
  .addColumn('name', 'text')
  .addColumn(
    "created_at",
    "timestamp",
    (cb) => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
  ).execute()
  
  await db.schema.createIndex('medias_id_index').on('medias').column('id').execute()
  await db.schema.createIndex('medias_id_file_id_index').on('medias').column('id').column('file_id').execute();
}

export async function down(db: Db) {
  await db.schema.dropTable("person").execute();
  await db.schema.dropTable("_cache").execute();
  await db.schema.dropTable('medias').execute();
  await db.schema.dropIndex('medias_id_index').execute()
  await db.schema.dropIndex('medias_id_file_id_index').execute()
}
