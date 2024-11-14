export interface SearchHistoryDynamoDbItem {
    userId: string;
    coinId: string;
    timestamp: string;
    ttl: number; // define time to live (ttl) – 30 day after being searched
}