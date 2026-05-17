import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
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

@Injectable()
export class AdminEventStreamService {
  private eventLog: SystemEvent[] = [];
  private readonly MAX_EVENTS = 1000;

  getEvents(limit: number = 50, offset: number = 0) {
    return this.eventLog
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  getEventsByType(type: string, limit: number = 50) {
    return this.eventLog
      .filter((e) => e.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  @OnEvent('goal.created')
  handleGoalCreated(event: DomainEvent) {
    this.logEvent({
      timestamp: event.timestamp,
      type: 'GOAL_CREATED',
      category: 'goal',
      title: 'Goal Created',
      description: `${event.actor.name} created a new goal`,
      actor: event.actor,
      metadata: event.data,
    });
  }

  @OnEvent('goal.submitted')
  handleGoalSubmitted(event: DomainEvent) {
    this.logEvent({
      timestamp: event.timestamp,
      type: 'GOAL_SUBMITTED',
      category: 'goal',
      title: 'Goal Submitted',
      description: `${event.actor.name} submitted a goal for review`,
      actor: event.actor,
      metadata: event.data,
    });
  }

  @OnEvent('goal.approved')
  handleGoalApproved(event: DomainEvent) {
    this.logEvent({
      timestamp: event.timestamp,
      type: 'GOAL_APPROVED',
      category: 'goal',
      title: 'Goal Approved',
      description: `${event.actor.name} approved a goal`,
      actor: event.actor,
      metadata: event.data,
    });
  }

  @OnEvent('goal.rejected')
  handleGoalRejected(event: DomainEvent) {
    this.logEvent({
      timestamp: event.timestamp,
      type: 'GOAL_REJECTED',
      category: 'goal',
      title: 'Goal Rework Requested',
      description: `${event.actor.name} requested rework on a goal`,
      actor: event.actor,
      metadata: event.data,
    });
  }

  @OnEvent('escalation.triggered')
  handleEscalationTriggered(event: DomainEvent) {
    this.logEvent({
      timestamp: event.timestamp,
      type: 'ESCALATION_TRIGGERED',
      category: 'escalation',
      title: 'Escalation Triggered',
      description: `Escalation: ${event.data.reason}`,
      actor: event.actor,
      metadata: event.data,
    });
  }

  @OnEvent('system.event')
  handleSystemEvent(event: DomainEvent) {
    this.logEvent({
      timestamp: event.timestamp,
      type: event.eventType,
      category: 'system',
      title: 'System Event',
      description: `System event: ${event.eventType}`,
      actor: event.actor,
      metadata: event.data,
    });
  }

  private logEvent(baseEvent: Omit<SystemEvent, 'id'>) {
    const systemEvent: SystemEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      ...baseEvent,
    };
    this.eventLog.push(systemEvent);

    // Keep only recent events in memory
    if (this.eventLog.length > this.MAX_EVENTS) {
      this.eventLog = this.eventLog.slice(-this.MAX_EVENTS);
    }
  }

  clearOldEvents(olderThanMinutes: number = 60) {
    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);
    this.eventLog = this.eventLog.filter((e) => e.timestamp > cutoff);
  }
}
