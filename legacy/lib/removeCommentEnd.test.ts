import removeCommentEnd from './removeCommentEnd';

describe('removeCommentEnd', () => {
  it('removes the end of a comment', () => {
    expect(removeCommentEnd('/* hi im a comment */')).toBe(
      '/* hi im a comment ',
    );
    expect(removeCommentEnd('<!-- hi im a comment -->')).toBe(
      '<!-- hi im a comment ',
    );
    expect(removeCommentEnd('{{# hi im a comment #}}')).toBe(
      '{{# hi im a comment ',
    );
    expect(removeCommentEnd('{{-- hi im a comment --}}')).toBe(
      '{{-- hi im a comment ',
    );
    expect(removeCommentEnd('{{ hi im a comment }}')).toBe(
      '{{ hi im a comment ',
    );
  });
});
