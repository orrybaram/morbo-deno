import removeCommentEnd from './removeCommentEnd.ts';
import { Definitions } from './defaultDefinitions.ts';


/**
 * Takes a line of a file and the line number, and returns an array of all of
 * the messages found in that line. Can return multiple messages per line, for
 * example, if a message was annotated with more than one type. EG: FIXME TODO
 *
 * Each message in the array will have a label, a lineNumber, a colorer, and a
 * message. Will also include an author property if one is found on the
 * message.
 *
 * @param   {String} lineString The
 * @param   {Number} lineNumber
 *
 * @return  {Array}
 */

type Message = {
  author: string | null;
  message: string | null;
  label: string | null;
  lineNumber: number;
  fileName: string;
  description?: string | null;
};

export default function getMessagesFromLine(
  definitions: Definitions,
  lineString: string,
  lineNumber: number,
  fileName: string,
) {
  const messageFormat: Message = {
    lineNumber,
    fileName,
    author: null,
    message: null,
    label: null,
    description: null,
  };
  const messages: Message[] = [];

  Object.keys(definitions).forEach(checkName => {
    const matchResults = lineString.match(definitions[checkName].regex);
    const checker = definitions[checkName];
    let thisMessage;

    if (matchResults && matchResults.length) {
      thisMessage = { ...messageFormat }; // Clone the above structure.

      thisMessage.label = checker.label;

      if (matchResults[2] && matchResults[2].length) {
        thisMessage.author = matchResults[2].trim();
      }

      if (matchResults[3] && matchResults[3].length) {
        thisMessage.message = removeCommentEnd(matchResults[3].trim());
      }

      if (definitions[checkName].description) {
        thisMessage.description = definitions[checkName].description;
      }
    }

    if (thisMessage) messages.push(thisMessage);
  });
  return messages;
}
