export = Leaderboard;
declare class Leaderboard {
    constructor(key?: string);
    key: string;
    prizePoolKey: string;
    add: (username: any, money: any) => void;
    remove: (username: any) => void;
    del: () => void;
    increase: (username: any, money: any) => void;
    getRank: (username: any) => Promise<any>;
    getRandomUser: () => Promise<any>;
    getTop: (limit?: number) => Promise<{
        username: any;
        money: any;
    }[]>;
    getAll: (cb: any) => Promise<void>;
    getRange: (start: any, end: any) => Promise<{
        username: any;
        money: any;
    }[]>;
    setPrizePool(amount: any): void;
    increasePrizePool(amount: any): void;
    getPrizePool(): Promise<any>;
}
