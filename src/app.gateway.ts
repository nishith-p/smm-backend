import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway(3001, { cors: true })
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  wss;

  handleConnection(client: any, ...args: any[]) {
    client.emit('connection', 'Successfully connected to socket.');
  }
}
