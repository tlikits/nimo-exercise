import { APIGatewayProxyHandler } from 'aws-lambda';
import { returnSuccess } from '../lib/utils';
import { querySearchHistory } from '../services/search-history';

const MOCKED_USER_ID = 'tlikits';

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = MOCKED_USER_ID; // TODO: retrieve user id
  const result = await querySearchHistory(userId);
  return returnSuccess(result);
};
