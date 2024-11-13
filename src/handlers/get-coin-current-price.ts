import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetCoinCurrentPriceResult } from '../interfaces/results';
import { returnNotFound, returnSuccess } from '../lib/utils';
import { putSearchHistory } from '../services/search-history';
import { getCoinDataById } from '../services/coin-gecko';

const MOCKED_USERID = 'tlikits';

async function getCoinCurrentPriceHandler(id: string): Promise<GetCoinCurrentPriceResult> {
  const coinData = await getCoinDataById(id);
  return {
    id,
    prices: {
      aud: coinData.market_data.current_price.aud,
      usd: coinData.market_data.current_price.usd,
    },
  };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const pathParameters  = event.pathParameters ?? {};
  const coinId = pathParameters['id'];
  const userId = MOCKED_USERID; // TODO: retrieve user id

  if (!coinId) {
    return returnNotFound('Please specify coin id');
  }

  const result = await getCoinCurrentPriceHandler(coinId);
  await putSearchHistory(userId, coinId);
  return returnSuccess(result);
};
