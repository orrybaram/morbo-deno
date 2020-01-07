import { spawnSync } from 'child_process';

type Results = {
  author: string | null;
  description?: string;
  fileName: string;
  label: string;
  lineNumber: number;
  message: string;
}[];

type GitBlameDataType = 'line' | 'commit';
type GitBlameDataResult = {
  finalLine: number;
  hash: string;
};

const getGitBlame = (scanPath: string, results: Results) => {
  return results.map(result => {
    const blameSpawn = spawnSync('git', [
      '-C',
      scanPath,
      'blame',
      `${scanPath}/${result.fileName}`,
      '-L',
      `${result.lineNumber}, ${result.lineNumber}`,
      '-p',
    ]);

    const blame = blameSpawn.stdout.toString();

    // Hack: this parses the blame, hopefully will stay reliable
    const splitBlame = blame.split('\n');
    let commitData = {};

    if (splitBlame.length > 1) {
      const hash = splitBlame[0].split(' ')[0];
      const authorName = splitBlame[1].replace('author ', '');
      const authorEmail = splitBlame[2].replace('author-mail ', '');
      const timestamp = splitBlame[3].replace('author-time ', '');
      const summary = splitBlame[9].replace('summary ', '');

      commitData = {
        hash,
        authorName,
        authorEmail,
        timestamp,
        summary,
      };
    }

    return {
      ...result,
      commitData,
    };
  });
};

export default getGitBlame;
