import { parseFlag } from './deps.ts';

import run from './src/run.ts';
import generateReport from './src/generateReport.ts';

export type Options = {
  customDefinitions?: { [key: string]: any };
  filesToScan?: string[];
  lineLengthLimit?: number;
  skip?: string[];
  rootDir?: string;
  showGitBlame?: boolean;
  skipChecks?: string[];
};

const defaultOptions = {
  lineLengthLimit: 1000,
  skip: [
    '**/node_modules',
    '**/.git',
    '**/.hg',
    '**/flow-typed',
    '**/morbo_report',
    '**/build',
    '**/dist',
    '**/config',
    '**/.vscode'
  ],
  rootDir: Deno.cwd(),
  showGitBlame: true,
  skipChecks: [],
};

function help() {
  return `
Usage:\n\
\n\
  morbo [options] [file|glob ...]\n\
\n\
Options:\n\
\n\
  -h, --help                 output usage information\n\
  -v, --version              output version\n\
  -s, --skip                 accepts a comma-seperated string of globs

\n\
Configuration:\n\
Create a .morborc file in the root directory of your project\n\
\n\
// Defaults\n\
${JSON.stringify(defaultOptions, null, 2)}
\n\
`;
}

async function main() {
  const args = parseFlag(Deno.args.slice(1));
  let options: Options = defaultOptions;

  if (args.help || args.h) {
    console.log(help());
    Deno.exit();
  }

  // Read options from .morborc
  try {
    const decoder = new TextDecoder('utf-8');
    const data = await Deno.readFile('.morborc');
    const config = decoder.decode(data);
    options = { ...JSON.parse(config) };
  } catch (err) {
    if (err.message.match(/No such file or directory/)) {
      console.warn('No .morborc file, using default settings');
    } else {
      console.log(err);
    }
  }

  const skipPatterns = args.skip || args.s;

  if (skipPatterns) {
    if (typeof skipPatterns === 'string') {
      options.skip = [...options.skip, ...skipPatterns.split(',')]
    } else {
      console.warn('Skip argument must be a string of comma-seperated globs')
      Deno.exit();
    }
  }

  /* TODO: skip files that are in the projects gitignore
    1. read gitignore file
    2. grab each line
    3. add to skip
  */

  const rootDir = args._;
  if (rootDir.length > 0) {
    options.rootDir = rootDir.join(',');
  }

  const messages = await run(options);

  // TODO: get git repo url

  generateReport(messages, options.rootDir);
}

main();
