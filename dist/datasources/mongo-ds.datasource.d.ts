import { LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
export declare class MongoDsDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName: string;
    static readonly defaultConfig: {
        name: string;
        connector: string;
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        useNewUrlParser: boolean;
        allowExtendedOperators: boolean;
    };
    constructor(dsConfig?: object);
}
