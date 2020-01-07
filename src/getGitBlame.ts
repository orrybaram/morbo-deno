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

const getGitBlame = async ({
  root,
  fileName,
  lineNumber,
}: {
  root: string;
  fileName: string;
  lineNumber: number;
}) => {

  console.log(fileName, root, lineNumber)

  const process = Deno.run({
    args: [
      'git',
      '-C',
      root,
      'blame',
      fileName,
      '-L',
      `${lineNumber}, ${lineNumber}`,
      '-p',
    ],
  });


  const result = await process.status()
  console.log(JSON.stringify(result, null, 2))

  // return code;
  // const blame = blameSpawn.stdout.toString();

  // // Hack: this parses the blame, hopefully will stay reliable
  // const splitBlame = blame.split('\n');
  // let commitData = {};

  // if (splitBlame.length > 1) {
  //   const hash = splitBlame[0].split(' ')[0];
  //   const authorName = splitBlame[1].replace('author ', '');
  //   const authorEmail = splitBlame[2].replace('author-mail ', '');
  //   const timestamp = splitBlame[3].replace('author-time ', '');
  //   const summary = splitBlame[9].replace('summary ', '');

  //   commitData = {
  //     hash,
  //     authorName,
  //     authorEmail,
  //     timestamp,
  //     summary,
  //   };
  // }

  // return {
  //   ...result,
  //   commitData,
  // };
};

export default getGitBlame;
