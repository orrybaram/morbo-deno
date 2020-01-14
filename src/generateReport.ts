import { copy, writeFileStr } from 'https://deno.land/std/fs/mod.ts';
import { join, parse, resolve } from 'https://deno.land/std/path/mod.ts';
import { Message } from './getMessagesFromLine.ts';

type Results = {
  [key: string]: {
    messages: Omit<Message, 'label'>[];
    description?: string;
  };
};

function formatResultsData(data: Message[]): any {
  const results: Results = {};

  data.forEach(message => {
    const { label, description, ...restMessage } = message;
    if (!results[message.label]) {
      results[message.label] = {
        messages: [],
        description,
      };
    }
    results[message.label].messages.push({ ...restMessage });
  });

  return {
    ...data,
    results,
  };
}

export default async function createReport(results: Message[], rootDir: string) {
  const json = JSON.stringify(formatResultsData(results), null, 2);
  const debtCollectorOutput = `window.techDebt = ${json}`;

  const parsedUrl = parse(import.meta.url);
  const file = join(parsedUrl.dir, './reporter').replace('file:', '');

  await copy(resolve(file), 'morbo_report', { overwrite: true });
  return writeFileStr('morbo_report/debt-collection.js', debtCollectorOutput);
}
