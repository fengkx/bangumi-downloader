import { PikPakClient } from "./pikpak.ts";
import { load } from "https://deno.land/std@0.216.0/dotenv/mod.ts";

export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const env = await load();
  console.log("Add 2 + 3 =", add(2, 3));
  const pikpak = new PikPakClient(
    env.PIKPAK_USER,
    env.PIKPAK_PASSWORD,
  );
  await pikpak.login();
  const resp = await pikpak.listFiles();
  console.log(resp);
  await pikpak.createFolder({ name: "test API" });
}
