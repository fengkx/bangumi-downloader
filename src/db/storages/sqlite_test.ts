import { assertEquals } from "https://deno.land/std@0.222.1/assert/mod.ts";
import { fromFileUrl } from "https://deno.land/std@0.216.0/path/from_file_url.ts";
import {
  beforeAll,
  afterAll,
  describe,
  it,
} from "https://deno.land/std@0.222.1/testing/bdd.ts";
import { SQLiteStorage } from "./sqlite.ts";

describe("sqlite storage test", () => {
  let storage: SQLiteStorage;
  beforeAll(async () => {
    const testPath = fromFileUrl(
      new URL("../../../tests/fixtures/db.sqlite3", import.meta.url),
    );
    storage = await SQLiteStorage.create(testPath);
  });

  it("should have stable stringify", async () => {
    await storage.cacheSet("a", { a: 1, b: 2, c: "D" });
    await storage.cacheSet("b", { c: "D", a: 1, b: 2 });
    const cacheItem1 = await storage.cacheGet("a");
    const cacheItem2 = await storage.cacheGet("b");
    assertEquals(cacheItem1?.value, cacheItem2?.value);
  });

  afterAll(async () => {
    await storage.close();
  })
});
