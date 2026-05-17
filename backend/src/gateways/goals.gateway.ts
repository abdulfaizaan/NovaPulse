import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../events/events.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  namespace: '/ws',
})
export class GoalsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(GoalsGateway.name);
  private userSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)?.add(client.id);
      this.logger.log(`User ${userId} connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)?.delete(client.id);
      if (this.userSockets.get(userId)?.size === 0) {
        this.userSockets.delete(userId);
      }
      this.logger.log(`User ${userId} disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    client.emit('pong');
  }

  @OnEvent('goal.created')
  handleGoalCreated(event: DomainEvent) {
    this.broadcastToTeam(event.data.employeeId, 'goal:created', event);
  }

  @OnEvent('goal.submitted')
  handleGoalSubmitted(event: DomainEvent) {
    this.broadcastToTeam(event.data.employeeId, 'goal:submitted', event);
  }

  @OnEvent('goal.approved')
  handleGoalApproved(event: DomainEvent) {
    this.broadcastToTeam(event.data.approverId, 'goal:approved', event);
    this.broadcastToTeam(event.actor.id, 'goal:approved', event);
  }

  @OnEvent('goal.rejected')
  handleGoalRejected(event: DomainEvent) {
    this.broadcastToTeam(event.actor.id, 'goal:rejected', event);
    this.broadcastToTeam(event.data.approverId, 'goal:rejected', event);
  }

  @OnEvent('escalation.triggered')
  handleEscalationTriggered(event: DomainEvent) {
    this.server.emit('escalation:triggered', event);
  }

  @OnEvent('system.event')
  handleSystemEvent(event: DomainEvent) {
    this.server.emit('system:event', event);
  }

  private broadcastToTeam(userId: string, eventType: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit(eventType, data);
      });
    }
  }

  broadcastToAll(eventType: string, data: any) {
    this.server.emit(eventType, data);
  }

  broadcastToUser(userId: string, eventType: string, data: any) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit(eventType, data);
      });
    }
  }
}
