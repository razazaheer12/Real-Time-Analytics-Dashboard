import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('RealtimeGateway');

  constructor(private jwtService: JwtService) {}

  handleConnection(client: AuthenticatedSocket) {
    try {
      // Token client se handshake ke query ya auth object se milega
      const token =
        client.handshake.auth?.token ||
        client.handshake.query?.token;

      if (!token) {
        this.logger.warn(`Client ${client.id} rejected — no token provided`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token as string, {
        secret: process.env.JWT_SECRET,
      });

      client.userId = payload.sub;
      client.userRole = payload.role;

      // Role-based room join karo
      if (payload.role === 'ADMIN') {
        client.join('admin-room');
        client.join('viewer-room'); // Admin ko viewer data bhi milega
      } else {
        client.join('viewer-room');
      }

      this.logger.log(`Client connected: ${client.id} (role: ${payload.role})`);
    } catch (err) {
      this.logger.warn(`Client ${client.id} rejected — invalid token`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Data simulator ye method call karega naya data emit karne ke liye
  emitToViewers(event: string, data: any) {
    this.server.to('viewer-room').emit(event, data);
  }

  emitToAdmins(event: string, data: any) {
    this.server.to('admin-room').emit(event, data);
  }
}