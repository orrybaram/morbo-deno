import { walk, readFileStr } from 'https://deno.land/std/fs/mod.ts';
import { globToRegExp } from  'https://deno.land/std/path/mod.ts';
import { Options } from '../mod.ts';
import getMessagesFromLine from '../legacy/lib/getMessagesFromLine.ts';
import defaultDefinitions from './defaultDefinitions.ts';
import getGitBlame from './getGitBlame.ts';

export default async function morbo(options: Options) {
  const regExSkips = options.skip.map((glob) => globToRegExp(glob));
  const messages = [];

  for await (const {filename, info} of walk(options.rootDir, {skip: regExSkips})) {
    if (info.isDirectory()) {
      continue;
    };

    const file  = await readFileStr(filename)
    const lines = file.split('\n');

    lines.forEach(async (line, idx) => {
      const lineNumber = idx + 1;
      const message = getMessagesFromLine(defaultDefinitions, line, lineNumber, filename)
      if (message.length) {
        const blame = await getGitBlame({ root: options.rootDir, lineNumber, fileName: filename})
        messages.push({ ...message});
      }
    })
  }

  console.log(JSON.stringify(messages, null, 2));
  return messages;
}