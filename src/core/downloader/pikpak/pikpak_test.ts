import { load } from "https://deno.land/std@0.216.0/dotenv/mod.ts";
import { PikPakClient } from "./pikpak.ts";

await load({ export: true });
const pikpak = new PikPakClient(
  Deno.env.get("PIKPAK_USER") ?? "",
  Deno.env.get("PIKPAK_PASSWORD") ?? "",
);
await pikpak.init();

const taskId = "VNvITSv3E-aRcXAAO-pgxi9Ro1";
const task = await pikpak.getTask(taskId);
console.log(task);
