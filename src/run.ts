import { walk } from 'https://deno.land/std/fs/mod.ts';
import { globToRegExp } from  'https://deno.land/std/path/mod.ts';
import { Options } from '../mod.ts';

export default async function morbo(options: Options) {

  const regExSkips = options.skip.map((glob) => globToRegExp(glob));

  for await (const {filename} of walk(options.rootDir, {skip: regExSkips})) {
    console.log(JSON.stringify(filename, null, 2))



  }
}