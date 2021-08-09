import {Socket} from 'socket.io';
import {ws} from '../websockets/decorators/websocket.decorator';


@ws({ name: 'leaderboard', namespace: /^\/leaderboard\/\d+$/  })
export class LeaderboardControllerWs {
  constructor(
    @ws.socket() // Equivalent to `@inject('ws.socket')`
    private socket: Socket,
  ) {}

  /**
   * The method is invoked when a client connects to the server
   * @param socket
   */
  @ws.connect()
  connect(socket: Socket) {
    // console.log('Client connected: %s', this.socket.id);
  }

  @ws.subscribe('rankChange')
  handleRankChange(users: any) {
    this.socket.nsp.emit('rank changed', `[${this.socket.id}] ${users}`);
  }

  /**
   * The method is invoked when a client disconnects from the server
   * @param socket
   */
  @ws.disconnect()
  disconnect() {
    // console.log('Client disconnected: %s', this.socket.id);
  }
}
