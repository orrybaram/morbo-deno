const inline = '\\/\\/';
const block = '\\*';
const jsx = '\\{#';
const jsx2 = '\\{/\\/\\*';
const hash = '#';
const html = '<!--';

const commentPrefixesRegex = `(${inline}|${html}|${jsx}|${jsx2}|${block}|${hash})`;

const commentRegex = (value: string) =>
  new RegExp(
    `(?:^|[^:])${commentPrefixesRegex}\\s*@?${value}\\b\\s*(?:\\(([^:]*)\\))*\\s*:?\\s*(.*)`,
    'i',
  );

export default commentRegex;
