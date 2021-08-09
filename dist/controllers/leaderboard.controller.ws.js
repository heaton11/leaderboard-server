"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardControllerWs = void 0;
const tslib_1 = require("tslib");
const websocket_decorator_1 = require("../websockets/decorators/websocket.decorator");
let LeaderboardControllerWs = class LeaderboardControllerWs {
    constructor(socket) {
        this.socket = socket;
    }
    /**
     * The method is invoked when a client connects to the server
     * @param socket
     */
    connect(socket) {
        // console.log('Client connected: %s', this.socket.id);
    }
    handleRankChange(users) {
        this.socket.nsp.emit('rank changed', `[${this.socket.id}] ${users}`);
    }
    /**
     * The method is invoked when a client disconnects from the server
     * @param socket
     */
    disconnect() {
        // console.log('Client disconnected: %s', this.socket.id);
    }
};
tslib_1.__decorate([
    websocket_decorator_1.ws.connect(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], LeaderboardControllerWs.prototype, "connect", null);
tslib_1.__decorate([
    websocket_decorator_1.ws.subscribe('rankChange'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], LeaderboardControllerWs.prototype, "handleRankChange", null);
tslib_1.__decorate([
    websocket_decorator_1.ws.disconnect(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], LeaderboardControllerWs.prototype, "disconnect", null);
LeaderboardControllerWs = tslib_1.__decorate([
    websocket_decorator_1.ws({ name: 'leaderboard', namespace: /^\/leaderboard\/\d+$/ }),
    tslib_1.__param(0, websocket_decorator_1.ws.socket()),
    tslib_1.__metadata("design:paramtypes", [Object])
], LeaderboardControllerWs);
exports.LeaderboardControllerWs = LeaderboardControllerWs;
//# sourceMappingURL=leaderboard.controller.ws.js.map