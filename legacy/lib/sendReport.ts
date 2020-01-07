import { request } from 'graphql-request';

export default function sendReport(
  payload: {
    results: any[];
    fileStats: { [extension: string]: number };
    linesOfCode: number;
  },
  {
    morboServerUri,
    projectId,
  }: { morboServerUri: string | null; projectId: string | null },
) {
  if (!morboServerUri || !projectId) return;

  const createReportMutation = `
    mutation createReportMutation(
      $items: [ReportitemsReportItem!],
      $fileStats: Json,
      $projectId: ID,
      $linesOfCode: Int
    ) {
      createReport(
        items: $items,
        fileStats: $fileStats,
        projectId: $projectId,
        linesOfCode: $linesOfCode
      ) {
        id
        fileStats
        linesOfCode
        items {
          id
          commitData {
            id
          }
        }
      }
    }
  `;

  const createReportVariables = {
    projectId,
    items: payload.results,
    fileStats: JSON.stringify(payload.fileStats),
    linesOfCode: payload.linesOfCode,
  };

  request(morboServerUri, createReportMutation, createReportVariables).then(
    data => {
      console.log('🛸 Report transmitted sucessfully!');
    },
  );
}
