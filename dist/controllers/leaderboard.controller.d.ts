import { Server } from 'socket.io';
import { UsersRepository } from '../repositories';
export declare class LeaderBoardController {
    usersRepository: UsersRepository;
    constructor(usersRepository: UsersRepository);
    giveMoney(username: string, amount: number): void;
    giveMoneyWithDeduction(username: string, amount: number): Promise<void>;
    getUsersWithRank(query: Object, start?: number): Promise<any[]>;
    getTopUsers(limit?: number): Promise<any[]>;
    getRandomUser(): Promise<{
        user: any;
        range: any[];
    }>;
    getUserRange(username: string): Promise<any[]>;
    getLeaderBoard(): Promise<{
        currentUser: any;
        users: any[];
    }>;
    giveRandomMoney(digit: number): Promise<void>;
    closeTheWeek(): Promise<void>;
    closeTheDay(): Promise<void>;
    generate(): Promise<void>;
    leaderboardEmmit(nsp: Server): Promise<any>;
}
