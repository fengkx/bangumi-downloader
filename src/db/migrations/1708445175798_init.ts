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
  ).addColumn('updated_at', 'timestamp', (cb) => cb.defaultTo(sql`CURRENT_TIMESTAMP`))
  .execute();
}

export async function down(db: Db) {
  await db.schema.dropTable("person").execute();
  await db.schema.dropTable("_cache").execute();
}
