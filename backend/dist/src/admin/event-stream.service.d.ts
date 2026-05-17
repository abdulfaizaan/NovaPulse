import { DomainEvent } from '../events/events.service';
export interface SystemEvent {
    id: string;
    timestamp: Date;
    type: string;
    category: 'goal' | 'escalation' | 'system' | 'webhook';
    title: string;
    description: string;
    actor: {
        id: string;
        email: string;
        name: string;
    };
    metadata: any;
}
export declare class AdminEventStreamService {
    private eventLog;
    private readonly MAX_EVENTS;
    getEvents(limit?: number, offset?: number): SystemEvent[];
    getEventsByType(type: string, limit?: number): SystemEvent[];
    handleGoalCreated(event: DomainEvent): void;
    handleGoalSubmitted(event: DomainEvent): void;
    handleGoalApproved(event: DomainEvent): void;
    handleGoalRejected(event: DomainEvent): void;
    handleEscalationTriggered(event: DomainEvent): void;
    handleSystemEvent(event: DomainEvent): void;
    private logEvent;
    clearOldEvents(olderThanMinutes?: number): void;
}
