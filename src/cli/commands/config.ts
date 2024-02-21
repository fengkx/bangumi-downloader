import { loadFile, generateCode } from "npm:magicast";
import { getDefaultExportOptions } from "npm:magicast/helpers";
import { EnumType } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { set, get } from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';


const supportedConfigEditActionEnum = ["add", "set"] as const;

export const configEditActionEnumType = new EnumType(
  supportedConfigEditActionEnum,
);
export type ConfigEditActionEnum =
  (typeof supportedConfigEditActionEnum)[number];

export async function configEdit(
  configFile: string,
  options: {
    action: ConfigEditActionEnum;
    key: string;
    value: string | number | boolean | undefined;
    dry_run: boolean
  },
) {
  const file = await loadFile(configFile);
  const config = getDefaultExportOptions(file);
  
  if(options.action === 'set') {
    set(config, options.key, options.value ?? undefined);
  }
  if(options.action == 'add') {
    const kp = get(config, options.key);
    if(kp.$type !== 'array') {
        throw new Error(`add action can only used in array field`)
    }

    // @ts-expect-error it is a proxy
    const existed = kp.find(item => item === options.value);
    if(!existed) {
        kp.push(options.value);
    }
  }
  if(options.dry_run) {
    console.log(generateCode(file).code)
  } else {

      await Deno.writeTextFile(configFile, generateCode(file).code)
  }
}
