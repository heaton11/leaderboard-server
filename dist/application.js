"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardApplication = void 0;
const tslib_1 = require("tslib");
const boot_1 = require("@loopback/boot");
const repository_1 = require("@loopback/repository");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const path_1 = tslib_1.__importDefault(require("path"));
const sequence_1 = require("./sequence");
const websocket_application_1 = require("./websockets/websocket.application");
const websocket_booter_1 = require("./websockets/websocket.booter");
class LeaderboardApplication extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(websocket_application_1.WebsocketApplication))) {
    constructor(options = {}) {
        super(options);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        this.component(rest_explorer_1.RestExplorerComponent);
        this.booters(websocket_booter_1.WebsocketControllerBooter);
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
            websocketControllers: {
                dirs: ['controllers'],
                extensions: ['.controller.ws.js'],
                nested: true,
            },
        };
        this.setupLogging();
    }
    setupLogging() {
        // Register `morgan` express middleware
        // Create a middleware factory wrapper for `morgan(format, options)`
        const morganFactory = (config) => {
            this.debug('Morgan configuration', config);
            return morgan_1.default('combined', config);
        };
        // Print out logs using `debug`
        const defaultConfig = {
            stream: {
                // @ts-ignore
                write: str => {
                    this._debug(str);
                },
            },
        };
        this.expressMiddleware(morganFactory, defaultConfig, {
            injectConfiguration: 'watch',
            key: 'middleware.morgan',
        });
    }
}
exports.LeaderboardApplication = LeaderboardApplication;
//# sourceMappingURL=application.js.map