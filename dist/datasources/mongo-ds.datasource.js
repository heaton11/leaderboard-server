"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDsDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'mongoDS',
    connector: 'mongodb',
    host: 'localhost',
    port: 27017,
    user: '',
    password: '',
    database: '',
    useNewUrlParser: true,
    allowExtendedOperators: true
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
let MongoDsDataSource = class MongoDsDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        super(dsConfig);
    }
};
MongoDsDataSource.dataSourceName = 'mongoDS';
MongoDsDataSource.defaultConfig = config;
MongoDsDataSource = tslib_1.__decorate([
    core_1.lifeCycleObserver('datasource'),
    tslib_1.__param(0, core_1.inject('datasources.config.mongoDS', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], MongoDsDataSource);
exports.MongoDsDataSource = MongoDsDataSource;
//# sourceMappingURL=mongo-ds.datasource.js.map