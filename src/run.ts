import { walk, readFileStr } from 'https://deno.land/std/fs/mod.ts';

export default async function run() {
  for await (const { filename, info } of walk(Deno.cwd(), {
    skip: [/^.*\/\.git$/],
  })) {
    if (info.isDirectory() || !info.isFile()) {
      continue;
    }

    const file = await readFileStr(filename);
    const lines = file.split('\n');

    lines.forEach(async (line, idx) => {
      if (!line) {
        return;
      }

      const lineNumber = idx + 1;

      const process = Deno.run({
        args: [
          'git',
          '-C',
          Deno.cwd(),
          'blame',
          filename,
          '-L',
          `${lineNumber}, ${lineNumber}`,
          '-p',
        ],
        stdout: 'piped',
      });

      await process.status();

      const decoder = new TextDecoder('utf-8');
      const result = await process.output();

      console.log(decoder.decode(result));
    });
  }
}
