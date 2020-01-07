export type Options = {
  ignoredDirectories: string[];
  createLocalReport: boolean;
  customDefinitions: {};
  fileEncoding: string;
  filesToScan: string[];
  lineLengthLimit: number;
  openReportOnCompletion: boolean;
  morboServerUri: string | null;
  projectId: string | null;
  scanPath: string;
  sendReportOnCompletion: boolean;
  showGitBlame: boolean;
  showSkippedChecks: boolean;
  skipChecks: string[];
  morboServerURI: null;
  repositoryUrl: string;
};

export const defaultOptions: Options = {
  ignoredDirectories: [
    '**/node_modules/**',
    '.git/**',
    '.hg/**',
    '**/flow-typed/**',
    '**/morbo_report/**',
    '**/build/**',
    '**/dist/**',
    'config/**',
  ],
  createLocalReport: false,
  customDefinitions: {},
  fileEncoding: 'utf8',
  filesToScan: ['**/*.{js,jsx,ts,tsx,php,go}'],
  lineLengthLimit: 1000,
  morboServerUri: null,
  morboServerURI: null,
  openReportOnCompletion: false,
  projectId: null,
  repositoryUrl: '',
  scanPath: process.cwd(),
  sendReportOnCompletion: true,
  showGitBlame: true,
  showSkippedChecks: false,
  skipChecks: [],
};

export default defaultOptions;