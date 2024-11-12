import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetSearchHistoryResult } from '../interfaces/results';
import { returnSuccess } from '../lib/utils';

function getSearchHistory(): GetSearchHistoryResult {
  // TODO: implement the logic to retrieve data from dynamodb
  return {
    items: [
      {
        coinId: 'bitcoin',
        timestamp: '2024-11-12T19:38:18.572Z'
      },
      {
        coinId: 'etherium',
        timestamp: '2024-11-12T19:50:18.572Z'
      }
    ],
  };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const result = getSearchHistory();
  return returnSuccess(result);
};
