import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DomainEvent } from '../events/events.service';
export declare class GoalsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    private userSockets;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handlePing(client: Socket): void;
    handleGoalCreated(event: DomainEvent): void;
    handleGoalSubmitted(event: DomainEvent): void;
    handleGoalApproved(event: DomainEvent): void;
    handleGoalRejected(event: DomainEvent): void;
    handleEscalationTriggered(event: DomainEvent): void;
    handleSystemEvent(event: DomainEvent): void;
    private broadcastToTeam;
    broadcastToAll(eventType: string, data: any): void;
    broadcastToUser(userId: string, eventType: string, data: any): void;
}
