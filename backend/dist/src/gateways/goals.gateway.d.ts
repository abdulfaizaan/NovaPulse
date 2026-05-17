import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DomainEvent } from '../events/events.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class GoalsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    server: Server;
    constructor(prisma: PrismaService);
    private logger;
    private userSockets;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handlePing(client: Socket): void;
    handleGoalCreated(event: DomainEvent): Promise<void>;
    handleGoalSubmitted(event: DomainEvent): Promise<void>;
    handleGoalApproved(event: DomainEvent): Promise<void>;
    handleGoalRejected(event: DomainEvent): Promise<void>;
    handleEscalationTriggered(event: DomainEvent): void;
    handleSystemEvent(event: DomainEvent): void;
    private broadcastToTeam;
    broadcastToAll(eventType: string, data: any): void;
    broadcastToUser(userId: string, eventType: string, data: any): void;
}
