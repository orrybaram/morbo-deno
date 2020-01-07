import path from 'path';
import fs from 'fs-extra';
import formatResultData from './formatResultData';

type Data = {
  results: {
    author: string | null,
    description?: string;
    fileName: string,
    label: string;
    lineNumber: number,
    message: string,
  }[]
}

export default function createReport(results: Data, callback: (path: string) => void) {
  const json = JSON.stringify(formatResultData(results), null, 2);
  const debtCollectorOutput = `window.techDebt = ${json}`;

  fs.copy(path.join(__dirname, '../reporter'), 'morbo_report').then(() => {
    fs.writeFileSync(
      'morbo_report/debt-collection.js',
      debtCollectorOutput,
      'utf8',
    );
    callback('morbo_report/index.html');
  });
}

module.exports = createReport;
