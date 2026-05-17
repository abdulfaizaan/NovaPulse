import { Injectable } from '@nestjs/common';
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

@Injectable()
export class EventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  async emitGoalCreated(goalId: string, employeeId: string, goalData: any, actor: any) {
    const event: DomainEvent = {
      timestamp: new Date(),
      aggregateId: goalId,
      aggregateType: 'Goal',
      eventType: 'GOAL_CREATED',
      actor: {
        id: actor.id,
        email: actor.email,
        name: actor.fullName,
      },
      data: goalData,
    };
    this.eventEmitter.emit('goal.created', event);
    return event;
  }

  async emitGoalSubmitted(goalId: string, employeeId: string, actor: any) {
    const event: DomainEvent = {
      timestamp: new Date(),
      aggregateId: goalId,
      aggregateType: 'Goal',
      eventType: 'GOAL_SUBMITTED',
      actor: {
        id: actor.id,
        email: actor.email,
        name: actor.fullName,
      },
      data: { employeeId },
    };
    this.eventEmitter.emit('goal.submitted', event);
    return event;
  }

  async emitGoalApproved(goalId: string, approverId: string, actor: any) {
    const event: DomainEvent = {
      timestamp: new Date(),
      aggregateId: goalId,
      aggregateType: 'Goal',
      eventType: 'GOAL_APPROVED',
      actor: {
        id: actor.id,
        email: actor.email,
        name: actor.fullName,
      },
      data: { approverId },
    };
    this.eventEmitter.emit('goal.approved', event);
    return event;
  }

  async emitGoalRejected(goalId: string, approverId: string, comment: string, actor: any) {
    const event: DomainEvent = {
      timestamp: new Date(),
      aggregateId: goalId,
      aggregateType: 'Goal',
      eventType: 'GOAL_REJECTED',
      actor: {
        id: actor.id,
        email: actor.email,
        name: actor.fullName,
      },
      data: { approverId, comment },
    };
    this.eventEmitter.emit('goal.rejected', event);
    return event;
  }

  async emitEscalationTriggered(escalationId: string, entityType: string, entityId: string, reason: string, actor: any) {
    const event: DomainEvent = {
      timestamp: new Date(),
      aggregateId: escalationId,
      aggregateType: 'Escalation',
      eventType: 'ESCALATION_TRIGGERED',
      actor: {
        id: actor?.id || 'system',
        email: actor?.email || 'system@novapulse.io',
        name: actor?.fullName || 'System',
      },
      data: { entityType, entityId, reason },
    };
    this.eventEmitter.emit('escalation.triggered', event);
    return event;
  }

  async emitSystemEvent(eventName: string, data: any) {
    const event: DomainEvent = {
      timestamp: new Date(),
      aggregateId: 'system-' + Date.now(),
      aggregateType: 'System',
      eventType: eventName,
      actor: {
        id: 'system',
        email: 'system@novapulse.io',
        name: 'System',
      },
      data,
    };
    this.eventEmitter.emit('system.event', event);
    return event;
  }
}
