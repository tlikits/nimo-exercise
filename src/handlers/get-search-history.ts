import { APIGatewayProxyHandler } from 'aws-lambda';
import { returnSuccess } from '../lib/utils';
import { querySearchHistory } from '../services/search-history';


export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.requestContext.authorizer?.claims.email;
  const result = await querySearchHistory(userId);
  return returnSuccess(result);
};
