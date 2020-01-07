
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

type Results = {
  [key: string]: {
    messages: any[];
    description?: string;
  }
}

export default function formatResultsData(data: Data): any {
  const results: Results = {};

  data.results.forEach(message => {
    const { label, description, ...restMessage } = message;
    if (!results[message.label]) {
      results[message.label] = {
        messages: [],
        description,
      };
    }
    results[message.label].messages.push({ ...restMessage });
  });

  return {
    ...data,
    results,
  };
}
