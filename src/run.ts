import { walk, readFileStr } from 'https://deno.land/std/fs/mod.ts';
import { globToRegExp } from 'https://deno.land/std/path/mod.ts';
import { Options } from '../mod.ts';
import getMessagesFromLine from './getMessagesFromLine.ts';
import defaultDefinitions from './defaultDefinitions.ts';
import getGitBlame from './getGitBlame.ts';
import parallel from './limiter.ts';

const loopFiles = async (iterable, messages, rootDir) => {
  const { value } = await iterable.next();

  if (!value) {
    return messages;
  }

  if (value.info.isDirectory()) {
    return loopFiles(iterable, messages, rootDir);
  }

  const file = await readFileStr(value.filename);
  const lines = file.split('\n');


  for(let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const lineNumber = idx + 1;
    const newMessages = getMessagesFromLine(
      defaultDefinitions,
      line,
      lineNumber,
      value.filename,
    );
    if (newMessages.length) {
      messages = [...messages, ...newMessages];
    }
    console.log('----------1---------------')
    await getGitBlame({ root: rootDir, lineNumber: lineNumber, fileName: value.filename})
    console.log('----------2---------------')
  }

  return loopFiles(iterable, messages, rootDir);
};

export default async function morbo(options: Options) {
  const regExSkips = options.skip.map(glob => globToRegExp(glob));
  let messages = [];

  const iterable = walk(options.rootDir, { skip: regExSkips });

  messages = await loopFiles(iterable, messages, options.rootDir);

  //   if (info.isDirectory()) {
  //     continue;
  //   };

  //   const file  = await readFileStr(filename)
  //   const lines = file.split('\n');

  //   lines.forEach(async (line, idx) => {
  //     const lineNumber = idx + 1;
  //     const newMessages = getMessagesFromLine(defaultDefinitions, line, lineNumber, filename)
  //     if (newMessages.length) {
  //       messages = [...messages, ...newMessages]
  //     }
  //   })
  // }

  // const blames = messages.map((message) => {
  //     return getGitBlame({ root: options.rootDir, lineNumber: message.lineNumber, fileName: message.fileName})
  // })

  // const result = await parallel(blames, 10)
  // console.log(result)

  console.log(JSON.stringify(messages, null, 2));
  // return messages;
}
