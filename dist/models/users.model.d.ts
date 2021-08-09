import { Entity } from '@loopback/repository';
export declare class Users extends Entity {
    playerId?: string;
    name: string;
    money: number;
    country: string;
    dailyRank: number;
    constructor(data?: Partial<Users>);
}
export interface UsersRelations {
}
export declare type UsersWithRelations = Users & UsersRelations;
