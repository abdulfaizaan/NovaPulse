import { EventEmitter2 } from '@nestjs/event-emitter';
export interface DomainEvent {
    timestamp: Date;
    aggregateId: string;
    aggregateType: string;
    eventType: string;
    actor: {
        id: string;
        email: string;
        name: string;
    };
    data: any;
    metadata?: {
        ipAddress?: string;
        userAgent?: string;
    };
}
export declare class EventsService {
    private eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    emitGoalCreated(goalId: string, employeeId: string, goalData: any, actor: any): Promise<DomainEvent>;
    emitGoalSubmitted(goalId: string, employeeId: string, actor: any): Promise<DomainEvent>;
    emitGoalApproved(goalId: string, approverId: string, actor: any): Promise<DomainEvent>;
    emitGoalRejected(goalId: string, approverId: string, comment: string, actor: any): Promise<DomainEvent>;
    emitEscalationTriggered(escalationId: string, entityType: string, entityId: string, reason: string, actor: any): Promise<DomainEvent>;
    emitSystemEvent(eventName: string, data: any): Promise<DomainEvent>;
}
