import isBinaryFile from 'isbinaryfile';
import minimatch from 'minimatch';

/**
 * Determines whether or not to let the file through. by ensuring that the
 * file name does not match one of the excluded directories, and ensuring it
 * matches one of the file filters.
 *
 * It will also ensure that even if a binary file matches the filter patterns,
 * it will not let it through as searching binary file contents for string
 * matches will never make sense.
 *
 */

// TODO: This could be simpler using minimatch negation patterns in one set,
// instead disparate ones for files and directories.

type FileFiltererOptions = {
  ignoredDirectories: string[];
  filesToScan: string[];
};

type FileInformation = {
  path: string;
  fullPath: string;
};

export default function fileFilterer({
  ignoredDirectories,
  filesToScan,
}: FileFiltererOptions) {
  return (fileInformation: FileInformation) => {
    let shouldIgnoreDirectory = false;
    let shouldIgnoreFile = true;
    let letTheFileThrough;

    ignoredDirectories.forEach(directoryPattern => {
      if (shouldIgnoreDirectory) return;
      shouldIgnoreDirectory = minimatch(
        fileInformation.path,
        directoryPattern,
        {
          dot: true,
        },
      );
    });

    if (!shouldIgnoreDirectory) {
      filesToScan.forEach(filePattern => {
        if (!shouldIgnoreFile) return;

        shouldIgnoreFile = !minimatch(fileInformation.path, filePattern);
      });
    }

    letTheFileThrough = !(
      shouldIgnoreDirectory ||
      (!shouldIgnoreDirectory && shouldIgnoreFile)
    );

    // Never let binary files through, searching them for comments will make no sense...
    if (letTheFileThrough && isBinaryFile.sync(fileInformation.fullPath)) {
      letTheFileThrough = false;
    }

    return letTheFileThrough;
  };
}
