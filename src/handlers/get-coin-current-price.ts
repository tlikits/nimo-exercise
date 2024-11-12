import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetCoinCurrentPriceResult } from '../interfaces/results';
import { returnNotFound, returnSuccess } from '../lib/utils';

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
  const id = pathParameters['id'];

  if (!id) {
    return returnNotFound('Please specify coin id');
  }

  const result = getCoinCurrentPriceHandler(id);
  return returnSuccess(result);
};
