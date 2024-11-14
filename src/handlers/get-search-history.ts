import { APIGatewayProxyHandler } from 'aws-lambda';
import { returnServerError, returnSuccess } from '../lib/utils';
import { querySearchHistory } from '../services/search-history';


export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const queryStringParameters = event.queryStringParameters ?? { nextToken: undefined }
        const nextToken = queryStringParameters['nextToken'];

        const userId = event.requestContext.authorizer?.claims.email;
        const result = await querySearchHistory(userId, nextToken);
        return returnSuccess(result);
    } catch (error) {
        console.error('Error getting search history:', error);
        return returnServerError('Failed to get search history', error as Error);
    }
};
