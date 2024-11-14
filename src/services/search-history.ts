import { SearchHistoryDynamoDbItem } from '../interfaces/dynamodb';
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient();
const TABLE_NAME = process.env.SEARCH_HISTORY_TABLE ?? '';

interface SearchHistoryItem {
    userId: string;
    coinId: string;
    timestamp: string;
}

interface SearchHistoryQuery {
    items: SearchHistoryItem[];
    nextToken: string | null;
}


export async function putSearchHistory(userId: string, coinId: string): Promise<void> {
    const item = buildSearchHistoryItem(userId, coinId);
    const marshalledItem = marshall(item);
    const input = {
        TableName: TABLE_NAME,
        Item: marshalledItem,
    };
    const command = new PutItemCommand(input);
    await client.send(command);
}

export async function querySearchHistory(userId: string, nextToken?: string): Promise<SearchHistoryQuery> {
    const command = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'userId-timestamp-index',
        ScanIndexForward: false,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': {
                S: userId,
            },
        },
        ConsistentRead: true,
        Limit: 20,
        // ExclusiveStartKey: JSON.parse(nextToken) ?? undefined,
    });
    const response = await client.send(command);
    const items = response.Items?.map(item => unmarshall(item) as SearchHistoryItem) ?? [];
    const newNextToken = response.LastEvaluatedKey ? JSON.stringify(response.LastEvaluatedKey) : null;
    return {
        items,
        nextToken: newNextToken,
    };
}

function buildSearchHistoryItem(userId: string, coinId: string): SearchHistoryDynamoDbItem {
    const now = new Date();
    return {
        userId,
        coinId,
        timestamp: now.toISOString(),
        ttl: getSearchHistoryItemTtl(now),
    };
}

function getSearchHistoryItemTtl(now: Date) {
    return Math.floor(now.getTime()/1000) + 2592000;
}
