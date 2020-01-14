import { walk, readFileStr } from 'https://deno.land/std/fs/mod.ts';
import { globToRegExp } from 'https://deno.land/std/path/mod.ts';
import { Options } from '../mod.ts';
import getMessagesFromLine, { Message } from './getMessagesFromLine.ts';
import defaultDefinitions from './defaultDefinitions.ts';
import getGitBlame from './getGitBlame.ts';

export default async function morbo(options: Options) {
  const regExSkips = options.skip.map(glob => globToRegExp(glob));
  let messages: Message[] = [];

  for await (const { filename, info } of walk(options.rootDir, {
    skip: regExSkips,
  })) {
    if (info.isDirectory() || !info.isFile()) {
      continue;
    }
    const file = await readFileStr(filename);
    const lines = file.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      if (!line) {
        continue;
      }
      const newMessages = getMessagesFromLine(
        defaultDefinitions,
        line,
        lineNumber,
        filename,
      );
      if (newMessages.length) {
        messages = [...messages, ...newMessages];
      }
    }
  }

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    const blame = await getGitBlame({
      root: options.rootDir,
      lineNumber: message.lineNumber,
      fileName: message.fileName,
    });

    message.blame = blame;
  }

  return messages;
}
