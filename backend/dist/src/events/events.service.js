"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let EventsService = class EventsService {
    eventEmitter;
    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }
    async emitGoalCreated(goalId, employeeId, goalData, actor) {
        const event = {
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
    async emitGoalSubmitted(goalId, employeeId, actor) {
        const event = {
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
    async emitGoalApproved(goalId, approverId, actor) {
        const event = {
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
    async emitGoalRejected(goalId, approverId, comment, actor) {
        const event = {
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
    async emitEscalationTriggered(escalationId, entityType, entityId, reason, actor) {
        const event = {
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
    async emitSystemEvent(eventName, data) {
        const event = {
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], EventsService);
//# sourceMappingURL=events.service.js.map