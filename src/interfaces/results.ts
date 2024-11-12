export interface GetCoinCurrentPriceResult {
    id: string;
    prices: { [key: string]: number };
}

export interface GetSearchHistoryResult {
    items: SearchHistoryItem[];
}

export interface SearchHistoryItem {
    coinId: string;
    timestamp: string;
}
