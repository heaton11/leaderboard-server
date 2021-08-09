import { Socket } from 'socket.io';
export declare class LeaderboardControllerWs {
    private socket;
    constructor(socket: Socket);
    /**
     * The method is invoked when a client connects to the server
     * @param socket
     */
    connect(socket: Socket): void;
    handleRankChange(users: any): void;
    /**
     * The method is invoked when a client disconnects from the server
     * @param socket
     */
    disconnect(): void;
}
