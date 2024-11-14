export interface SearchHistoryDynamoDbItem {
    pk: string; // userId
    sk: string; // coinId
    timestamp: string;
    ttl: number; // define time to live (ttl) – 30 day after being searched
}