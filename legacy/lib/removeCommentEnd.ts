/**
 * Removes the end of html, twig and handlebar comments. EG: -->, --}}, etc.
 *
 * @param   {String} str
 *
 * @return  {String}
 */
export default function removeCommentEnd(str: string): string {
  let replaceString = str;

  const commentEnds = ['-->', '#}}', '*/', '--}}', '}}', '*/}', '}'];

  for (let i = 0; i < commentEnds.length; i += 1) {
    replaceString = replaceString.replace(commentEnds[i], '');
  }
  return replaceString;
}
