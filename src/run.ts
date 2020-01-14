import { walk, readFileStr, globToRegExp } from '../deps.ts';
import { Options } from '../mod.ts';
import getMessagesFromLine from './getMessagesFromLine.ts';
import defaultDefinitions from './defaultDefinitions.ts';
import getGitBlame from './getGitBlame.ts';
import parallel from './limiter.ts';

export default async function morbo(options: Options) {
  const regExSkips = options.skip.map((glob) => globToRegExp(glob));
  let messages = [];

  for await (const {filename, info} of walk(options.rootDir, {skip: regExSkips})) {
    if (info.isDirectory()) {
      continue;
    };

    const file  = await readFileStr(filename)
    const lines = file.split('\n');

    lines.forEach(async (line, idx) => {
      const lineNumber = idx + 1;
      const newMessages = getMessagesFromLine(defaultDefinitions, line, lineNumber, filename)
      if (newMessages.length) {
        messages = [...messages, ...newMessages]
      }
    })
  }

  const blames = messages.map((message) => {
      return getGitBlame({ root: options.rootDir, lineNumber: message.lineNumber, fileName: message.fileName})
  })

  const result = await parallel(blames, 10)
  console.log(result)

  // console.log(JSON.stringify(messages, null, 2));
  return messages;
}