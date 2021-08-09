import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDsDataSource } from '../datasources';
import { Users, UsersRelations } from '../models';
export declare class UsersRepository extends DefaultCrudRepository<Users, typeof Users.prototype.playerId, UsersRelations> {
    constructor(dataSource: MongoDsDataSource);
}
