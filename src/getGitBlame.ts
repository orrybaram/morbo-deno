export type GitBlame = {
  hash: string;
  authorName: string;
  authorEmail: string;
  timestamp: string;
  summary: string;
};

const getGitBlame = async ({
  root,
  fileName,
  lineNumber,
}: {
  root: string;
  fileName: string;
  lineNumber: number;
}) => {
  const process = Deno.run({
    args: [
      'git',
      '-C',
      Deno.cwd(),
      'blame',
      fileName,
      '-L',
      `${lineNumber}, ${lineNumber}`,
      '-p',
    ],
    stdout: 'piped',
  });

  await process.status();

  const decoder = new TextDecoder('utf-8');
  const result = await process.output();
  process.close();

  const blame = decoder.decode(result);

  // Hack: this parses the blame, hopefully will stay reliable
  const splitBlame = blame.split('\n');
  let commitData = {} as GitBlame;

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

  return commitData;
};

export default getGitBlame;
