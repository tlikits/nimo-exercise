import { SearchHistoryDynamoDbItem } from '../interfaces/dynamodb';
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient();

export async function putSearchHistory(userId: string, coinId: string): Promise<void> {
    const item = buildSearchHistoryItem(userId, coinId);
    const marshalledItem = marshall(item);
    const input = {
        Item: marshalledItem,
        TableName: process.env.SEARCH_HISTORY_TABLE,
    };
    const command = new PutItemCommand(input);
    const response = await client.send(command);
    console.log(response);

}

function buildSearchHistoryItem(userId: string, coinId: string): SearchHistoryDynamoDbItem {
    const now = new Date();
    return {
        pk: userId,
        sk: coinId,
        timestamp: now.toISOString(),
        ttl: getSearchHistoryItemTtl(now),
    };
}

function getSearchHistoryItemTtl(now: Date) {
    return Math.floor(now.getTime()/1000) + 2592000;
}
