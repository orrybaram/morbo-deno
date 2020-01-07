/* eslint-disable max-len,no-console */
import eventStream from 'event-stream';
import fs from 'fs';
import readdirp from 'readdirp';
import open from 'open';

import fileFilterer from './lib/fileFilterer';
import getMessagesFromLine from './lib/getMessagesFromLine';
import createReport from './lib/createReport';
import MorboSpinner from './lib/spinner';
import defaultOptions, { Options } from './lib/defaultOptions';
import getGitBlame from './lib/getGitBlame';
import sendReport from './lib/sendReport';
import defaultDefinitions, { Definitions } from './lib/defaultDefinitions';

type FileInformation = {
  fullPath: string;
  path: string;
};

const spinner = new MorboSpinner();

/**
 * Reads through the configured path scans the matching files for messages.
 */
function scanAndProcessMessages({
  createLocalReport = defaultOptions.createLocalReport,
  customDefinitions = defaultOptions.customDefinitions,
  fileEncoding = defaultOptions.fileEncoding,
  filesToScan = defaultOptions.filesToScan,
  ignoredDirectories = defaultOptions.ignoredDirectories,
  lineLengthLimit = defaultOptions.lineLengthLimit,
  morboServerUri = defaultOptions.morboServerUri,
  openReportOnCompletion = defaultOptions.openReportOnCompletion,
  projectId = defaultOptions.projectId,
  repositoryUrl = defaultOptions.repositoryUrl,
  scanPath = defaultOptions.scanPath,
  sendReportOnCompletion = defaultOptions.sendReportOnCompletion,
  showGitBlame = defaultOptions.showGitBlame,
  showSkippedChecks = defaultOptions.showSkippedChecks,
  skipChecks = defaultOptions.skipChecks,
}) {
  return new Promise((resolve, reject) => {
    const payload: any = {
      results: [],
      repositoryUrl,
      fileStats: {},
      linesOfCode: 0,
    };

    spinner.start();

    const definitions: Definitions = {
      ...defaultDefinitions,
      ...customDefinitions,
    };

    const stream = readdirp({
      root: scanPath,
      fileFilter: fileFilterer({ ignoredDirectories, filesToScan }),
    });

    // Remove skipped checks for our mapping
    skipChecks.forEach((checkName: string) => {
      if (definitions[checkName]) {
        delete definitions[checkName];
      }
    });

    const getFileExtension = (fileName: string) => fileName.split('.').pop();

    const dupeFiles: any = {};

    // TODO: Actually do something meaningful/useful with these handlers.
    stream.on('warn', console.warn).on('error', console.error);

    stream.pipe(
      eventStream.map(
        (fileInformation: FileInformation, callback: () => void) => {
          const input = fs.createReadStream(fileInformation.fullPath, {
            encoding: fileEncoding,
          });

          // Dont rescan files we already scanned
          if (dupeFiles[fileInformation.path]) {
            return;
          } else {
            dupeFiles[fileInformation.path] = 1;
          }

          const fileExtension = getFileExtension(fileInformation.path);

          // Count file types by extension
          if (fileExtension) {
            if (payload.fileStats[fileExtension]) {
              payload.fileStats[fileExtension] += 1;
            } else {
              payload.fileStats[fileExtension] = 1;
            }
          }

          let currentFileLineNumber = 1;

          input.pipe(eventStream.split()).pipe(
            eventStream.map((fileLineString: string) => {
              let messages;
              let lengthError;

              if (fileLineString.length < lineLengthLimit) {
                messages = getMessagesFromLine(
                  definitions,
                  fileLineString,
                  currentFileLineNumber,
                  fileInformation.path,
                );

                messages.forEach(message => {
                  payload.results.push(message);
                });
              } else if (showSkippedChecks) {
                lengthError = `${'Morbo is skipping this line because its length is ' +
                  'greater than the maximum line-length of '}${lineLengthLimit}.`;

                payload.results.push({
                  message: lengthError,
                  lineNumber: currentFileLineNumber,
                  label: 'SKIPPED CHECK',
                  fileName: fileInformation.fullPath,
                });
              }

              currentFileLineNumber += 1;
              payload.linesOfCode += 1;
              return null;
            }),
          );

          return callback();
        },
      ),
    );

    stream.on('end', async () => {
      if (showGitBlame) {
        spinner.updateText('Finding the humans responsible');
        payload.results = getGitBlame(scanPath, payload.results);
      }

      if (createLocalReport) {
        createReport(payload, file => {
          spinner.succeed(file);

          if (openReportOnCompletion) {
            open(file);
          }
        });
      } else {
        spinner.spinner.succeed();
      }

      if (sendReportOnCompletion) {
        sendReport(payload, { morboServerUri, projectId });
      }
      resolve(payload);
    });
  });
}

export default scanAndProcessMessages;
