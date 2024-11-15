import { APIGatewayProxyHandler } from 'aws-lambda';
import { GetCoinCurrentPriceResult } from '../interfaces/results';
import { returnNotFound, returnServerError, returnSuccess } from '../lib/utils';
import { getCoinDataById } from '../services/coin-gecko';
import { putSearchHistory } from '../services/search-history';
import { sendEmail } from '../services/ses';

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

async function sendEmailNotification(userId: string, result: GetCoinCurrentPriceResult): Promise<void> {
	const subject = `Current Price of ${result.id}`;
	const bodyText = `Hello,\n\nThe current price of ${result.id} is ${result.prices.aud} AU$ (${result.prices.usd} $)`;
	const bodyHtml = `
		<html>
			<body>
				<p>Hello,</p>
				<p>The current price of <strong>${result.id}</strong> is <strong>${result.prices.aud} AU$ (${result.prices.usd} $</strong>.</p>
			</body>
		</html>`;
	await sendEmail(userId, subject, bodyText, bodyHtml)
}

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const pathParameters  = event.pathParameters ?? {};
		const coinId = pathParameters['id'];
		const userId = event.requestContext.authorizer?.claims.email;

		if (!coinId) {
			return returnNotFound('Please specify coin id');
		}

		const result = await getCoinCurrentPriceHandler(coinId);
		await sendEmailNotification(userId, result).catch(err => console.error('Error while send email', err.message));
		await putSearchHistory(userId, coinId);
		return returnSuccess(result);
	} catch (error: unknown) {
		console.error('Error get coin current price:', error);
		return returnServerError('Failed to get coin current price', error as Error);
	}
};
