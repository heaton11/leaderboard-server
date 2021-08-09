import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Users } from '../models';
import { UsersRepository } from '../repositories';
export declare class UsersController {
    usersRepository: UsersRepository;
    constructor(usersRepository: UsersRepository);
    create(users: Omit<Users, 'playerId'>): Promise<Users>;
    count(where?: Where<Users>): Promise<Count>;
    find(filter?: Filter<Users>): Promise<Users[]>;
    updateAll(users: Users, where?: Where<Users>): Promise<Count>;
    findById(id: string, filter?: FilterExcludingWhere<Users>): Promise<Users>;
    updateById(id: string, users: Users): Promise<void>;
    replaceById(id: string, users: Users): Promise<void>;
    deleteById(id: string): Promise<void>;
}
