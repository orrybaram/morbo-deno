// NOTE: This is the sample output for a note!
// OPTIMIZE (Phillip J. Fry): This is the sample output for an optimize with an author!
// TODO: This is the sample output for a todo!
// HACK: This is the sample output for a hack! Don't commit hacks!
// XXX: This is the sample output for a XXX! XXX's need attention too!
// FIXME (Turanga Leela): This is the sample output for a fixme! Seriously fix this...
// BUG: This is the sample output for a bug! Who checked in a bug?!
/* BUG: This is the sample output for a bug! Who checked in a bug?! */


// The next line is just a URL
// https://bugzilla.mozilla.org/show_bug.cgi?id=1399196

require('../src/')({ // NOTE: It doesn't need to be placed at line start!
  path: process.cwd(),
  ignored_directories: ['node_modules/**', '.git/**'],
  file_patterns: ['**/*.js'],
  file_encoding: 'utf8',
  line_length_limit: 1000,
});
