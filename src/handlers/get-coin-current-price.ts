import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetCoinCurrentPriceResult } from '../interfaces/results';
import { returnNotFound, returnSuccess } from '../lib/utils';
import { putSearchHistory } from '../services/search-history';

const MOCKED_USERID = 'tlikits';

function getCoinCurrentPriceHandler(id: string): GetCoinCurrentPriceResult {
  // TODO: implement the logic to retrieve data from coingecko
  return {
    id,
    prices: {
      aud: 100,
      usd: 100,
    }
  };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const pathParameters  = event.pathParameters ?? {};
  const coinId = pathParameters['id'];
  const userId = MOCKED_USERID; // TODO: retrieve user id

  if (!coinId) {
    return returnNotFound('Please specify coin id');
  }

  const result = getCoinCurrentPriceHandler(coinId);
  await putSearchHistory(userId, coinId);
  return returnSuccess(result);
};
