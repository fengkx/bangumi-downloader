import { assertEquals } from "https://deno.land/std@0.216.0/assert/mod.ts";
import { add } from "./cli/commands/main.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
