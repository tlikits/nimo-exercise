import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetCoinCurrentPriceResult } from '../interfaces/results';
import { returnNotFound, returnSuccess } from '../lib/utils';
import { putSearchHistory } from '../services/search-history';
import { getCoinDataById } from '../services/coin-gecko';
import { sendEmail } from '../services/ses';

const MOCKED_USER_ID = 'tlikits';
const MOCKED_USER_EMAIL = 'thanchanok.likitsinsopon@gmail.com';

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

async function sendEmailNotification(result: GetCoinCurrentPriceResult): Promise<void> {
  const subject = `Current Price of ${result.id}`;
  const bodyText = `Hello,\n\nThe current price of ${result.id} is ${result.prices.aud} AU$ (${result.prices.usd} $)`;
  const bodyHtml = `
    <html>
      <body>
        <p>Hello,</p>
        <p>The current price of <strong>${result.id}</strong> is <strong>${result.prices.aud} AU$ (${result.prices.usd} $</strong>.</p>
      </body>
    </html>`;
  await sendEmail(MOCKED_USER_EMAIL, subject, bodyText, bodyHtml)
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const pathParameters  = event.pathParameters ?? {};
  const coinId = pathParameters['id'];
  const userId = MOCKED_USER_ID; // TODO: retrieve user id

  if (!coinId) {
    return returnNotFound('Please specify coin id');
  }

  const result = await getCoinCurrentPriceHandler(coinId);
  await sendEmailNotification(result);
  await putSearchHistory(userId, coinId);
  return returnSuccess(result);
};
