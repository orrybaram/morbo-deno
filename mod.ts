import { parse } from 'https://deno.land/std/flags/mod.ts';

import run from './src/run.ts';

async function main() {
  const args = parse(Deno.args.slice(1));
  run();
}

main();
