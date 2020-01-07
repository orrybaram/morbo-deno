import formatResultData from './formatResultData';

describe('formatResultData', () => {
  const data = {
    otherData: 'hello!',
    results: [
      {
        author: null,
        message: 'This is the sample output for a note!',
        label: 'NOTE',
        lineNumber: 1,
        fileName: 'test/annotation_test.js',
      },
      {
        author: null,
        message: 'This is the sample output for a todo!',
        label: 'TODO',
        lineNumber: 3,
        fileName: 'test/annotation_test.js',
      },
      {
        author: null,
        message: 'This is the sample output for a bug! Who checked in a bug?!',
        label: 'BUG',
        lineNumber: 7,
        fileName: 'test/annotation_test.js',
      },
      {
        author: null,
        message: 'This is the sample output for a bug! Who checked in a bug?! ',
        label: 'BUG',
        lineNumber: 8,
        fileName: 'test/annotation_test.js',
      },
      {
        author: null,
        message: 'this is an html test ',
        label: 'TODO',
        lineNumber: 9,
        fileName: 'test/annotation_test.js',
      },
      {
        author: null,
        message:
          'This could be simpler using minimatch negation patterns in one set,',
        label: 'TODO',
        lineNumber: 15,
        fileName: 'src/lib/fileFilterer.js',
      },
    ],
  };

  const expected = {
    otherData: 'hello!',
    results: {
      NOTE: {
        messages: [
          {
            author: null,
            message: 'This is the sample output for a note!',
            lineNumber: 1,
            fileName: 'test/annotation_test.js',
          },
        ],
      },
      TODO: {
        messages: [
          {
            author: null,
            message: 'This is the sample output for a todo!',
            lineNumber: 3,
            fileName: 'test/annotation_test.js',
          },
          {
            author: null,
            message: 'this is an html test ',
            lineNumber: 9,
            fileName: 'test/annotation_test.js',
          },
          {
            author: null,
            message:
              'This could be simpler using minimatch negation patterns in one set,',
            lineNumber: 15,
            fileName: 'src/lib/fileFilterer.js',
          },
        ],
      },
      BUG: {
        messages: [
          {
            author: null,
            message: 'This is the sample output for a bug! Who checked in a bug?!',
            lineNumber: 7,
            fileName: 'test/annotation_test.js',
          },
          {
            author: null,
            message: 'This is the sample output for a bug! Who checked in a bug?! ',
            lineNumber: 8,
            fileName: 'test/annotation_test.js',
          },
        ],
      },
    }
  };

  it('formats data by labels', () => {
    expect(formatResultData(data)).toEqual(expected);
  });
});
