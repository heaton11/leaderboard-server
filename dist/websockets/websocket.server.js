"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const context_1 = require("@loopback/context");
const websocket_controller_factory_1 = require("./websocket-controller-factory");
const websocket_decorator_1 = require("./decorators/websocket.decorator");
const SocketIOServer = require("socket.io");
const debug = require('debug')('loopback:websocket');
/**
 * A websocket server
 */
class WebSocketServer extends context_1.Context {
    constructor(ctx, httpServer, options = {}) {
        super(ctx);
        this.ctx = ctx;
        this.httpServer = httpServer;
        this.options = options;
        this.io = SocketIOServer(options);
        ctx.bind('ws.server').to(this.io);
    }
    /**
     * Register a sock.io middleware function
     * @param fn
     */
    use(fn) {
        return this.io.use(fn);
    }
    /**
     * Register a websocket controller
     * @param ControllerClass
     * @param meta
     */
    route(ControllerClass, meta) {
        if (meta instanceof RegExp || typeof meta === 'string') {
            meta = { namespace: meta };
        }
        if (meta == null) {
            meta = websocket_decorator_1.getWebSocketMetadata(ControllerClass);
        }
        const nsp = (meta && meta.namespace) ? this.io.of(meta.namespace) : this.io;
        if (meta && meta.name) {
            this.ctx.bind(`ws.namespace.${meta.name}`).to(nsp);
        }
        /* eslint-disable @typescript-eslint/no-misused-promises */
        nsp.on('connection', async (socket) => {
            console.log('connection', 'connection');
            debug('Websocket connected: id=%s namespace=%s', socket.id, socket.nsp.name);
            // Create a request context
            const reqCtx = new context_1.Context(this);
            // Bind websocket
            reqCtx.bind('ws.socket').to(socket);
            // Instantiate the controller instance
            await new websocket_controller_factory_1.WebSocketControllerFactory(reqCtx, ControllerClass).create(socket);
        });
        return nsp;
    }
    /**
     * Start the websocket server
     */
    async start() {
        await this.httpServer.start();
        // FIXME: Access HttpServer.server
        const server = this.httpServer.server;
        this.io.attach(server, this.options);
    }
    /**
     * Stop the websocket server
     */
    async stop() {
        const close = new Promise((resolve, reject) => {
            this.io.close(() => {
                resolve();
            });
        });
        await close;
        await this.httpServer.stop();
    }
}
exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=websocket.server.js.map