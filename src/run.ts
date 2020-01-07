import { walk, readFileStr } from 'https://deno.land/std/fs/mod.ts';
import { globToRegExp } from  'https://deno.land/std/path/mod.ts';
import { Options } from '../mod.ts';
import getMessagesFromLine from '../legacy/lib/getMessagesFromLine.ts';
import defaultDefinitions from './defaultDefinitions.ts';

export default async function morbo(options: Options) {

  const regExSkips = options.skip.map((glob) => globToRegExp(glob));
  const messages = [];

  for await (const {filename} of walk(options.rootDir, {skip: regExSkips})) {
    const file  = await readFileStr(filename)
    const lines = file.split('\n');

    lines.forEach((line, idx) => {
      const message = getMessagesFromLine(defaultDefinitions, line, idx + 1, filename)

      if (message.length) {
        messages.push(message);
      }

    })
  }

  console.log(JSON.stringify(messages, null, 2));
  return messages;
}