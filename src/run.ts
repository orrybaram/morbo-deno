import { walk, readFileStr } from 'https://deno.land/std/fs/mod.ts';

export default async function run() {
  for await (const { filename, info } of walk(Deno.cwd())) {
    if (info.isDirectory() || !info.isFile()) {
      continue;
    }

    const file = await readFileStr(filename);
    const lines = file.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line) {
        continue;
      }

      const lineNumber = i + 1;

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
      process.close();

      console.log(decoder.decode(result));
    }
  }
}
