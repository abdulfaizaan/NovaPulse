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
import { PrismaService } from '../prisma/prisma.service';

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

  constructor(private prisma: PrismaService) {}

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
  async handleGoalCreated(event: DomainEvent) {
    this.broadcastToTeam(event.data.employeeId, 'goal:created', event);
    const employee = await this.prisma.user.findUnique({
      where: { id: event.data.employeeId },
      select: { managerId: true }
    });
    if (employee?.managerId) {
      this.broadcastToTeam(employee.managerId, 'goal:created', event);
    }
  }

  @OnEvent('goal.submitted')
  async handleGoalSubmitted(event: DomainEvent) {
    this.broadcastToTeam(event.data.employeeId, 'goal:submitted', event);
    const goal = await this.prisma.goal.findUnique({
      where: { id: event.aggregateId },
      include: { employee: true }
    });
    if (goal?.employee?.managerId) {
      this.broadcastToTeam(goal.employee.managerId, 'goal:submitted', event);
    }
  }

  @OnEvent('goal.approved')
  async handleGoalApproved(event: DomainEvent) {
    const goal = await this.prisma.goal.findUnique({
      where: { id: event.aggregateId },
      select: { employeeId: true }
    });
    if (goal?.employeeId) {
      this.broadcastToTeam(goal.employeeId, 'goal:approved', event);
      this.broadcastToTeam(event.actor.id, 'goal:approved', event);
    }
  }

  @OnEvent('goal.rejected')
  async handleGoalRejected(event: DomainEvent) {
    const goal = await this.prisma.goal.findUnique({
      where: { id: event.aggregateId },
      select: { employeeId: true }
    });
    if (goal?.employeeId) {
      this.broadcastToTeam(goal.employeeId, 'goal:rejected', event);
      this.broadcastToTeam(event.actor.id, 'goal:rejected', event);
    }
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
