import commentRegex from './commentRegex.ts';

export type Definitions = {
  [key: string]: {
    regex: RegExp;
    description?: string;
    label: string;
  };
};

const defaultDefinitions: Definitions = {
  note: {
    regex: commentRegex('NOTE'),
    label: 'Notes',
  },
  optimize: {
    regex: commentRegex('OPTIMIZE'),
    label: 'Optimizations',
  },
  todo: {
    regex: commentRegex('TODO'),
    label: 'Todos',
  },
  hack: {
    regex: commentRegex('HACK'),
    label: 'Hacks',
  },
  fixme: {
    regex: commentRegex('FIXME'),
    label: 'FixMes',
  },
  bug: {
    regex: commentRegex('BUG'),
    label: 'Bugs',
  },
};

export default defaultDefinitions;
