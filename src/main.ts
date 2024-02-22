import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { main as mainCmd } from "./cli/commands/main.ts";
import { resolve as pathResolve } from "https://deno.land/std@0.216.0/path/resolve.ts";
import { configEditActionEnumType } from "./cli/commands/config.ts";
import { configEdit } from "./cli/commands/config.ts";

// TODO: type
// import { ConfigEditActionEnum } from "./cli/commands/config.ts";

async function main() {
  await new Command()
    .type("action", configEditActionEnumType)
    .name("BangumiDownloader")
    .version("0.1.0")
    .description("Bangumi downloader")
    .globalOption(
      "--config <configFile>",
      "path to  a js / ts file export a config object as default",
      { required: true },
    )
    .action(async (options) => {
      const configFile = pathResolve(options.config);
      await mainCmd({ configFile });
    })
    .command("config <action:string> <key:string>  [value]")
    .option("--dry-run", "Print changed config")
    .action(async (options, action, key, value) => {
      const configFile = pathResolve(options.config);
      // @ts-expect-error TODO:
      await configEdit(configFile, {
        action,
        key,
        value,
        dry_run: options.dryRun,
      });
    })
    .parse(Deno.args);
}

main();
