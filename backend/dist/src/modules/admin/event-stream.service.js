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
exports.AdminEventStreamService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let AdminEventStreamService = class AdminEventStreamService {
    eventLog = [];
    MAX_EVENTS = 1000;
    getEvents(limit = 50, offset = 0) {
        return this.eventLog
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(offset, offset + limit);
    }
    getEventsByType(type, limit = 50) {
        return this.eventLog
            .filter((e) => e.type === type)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit);
    }
    handleGoalCreated(event) {
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
    handleGoalSubmitted(event) {
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
    handleGoalApproved(event) {
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
    handleGoalRejected(event) {
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
    handleEscalationTriggered(event) {
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
    handleSystemEvent(event) {
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
    logEvent(baseEvent) {
        const systemEvent = {
            id: `event-${Date.now()}-${Math.random()}`,
            ...baseEvent,
        };
        this.eventLog.push(systemEvent);
        if (this.eventLog.length > this.MAX_EVENTS) {
            this.eventLog = this.eventLog.slice(-this.MAX_EVENTS);
        }
    }
    clearOldEvents(olderThanMinutes = 60) {
        const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);
        this.eventLog = this.eventLog.filter((e) => e.timestamp > cutoff);
    }
};
exports.AdminEventStreamService = AdminEventStreamService;
__decorate([
    (0, event_emitter_1.OnEvent)('goal.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminEventStreamService.prototype, "handleGoalCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.submitted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminEventStreamService.prototype, "handleGoalSubmitted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.approved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminEventStreamService.prototype, "handleGoalApproved", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.rejected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminEventStreamService.prototype, "handleGoalRejected", null);
__decorate([
    (0, event_emitter_1.OnEvent)('escalation.triggered'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminEventStreamService.prototype, "handleEscalationTriggered", null);
__decorate([
    (0, event_emitter_1.OnEvent)('system.event'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminEventStreamService.prototype, "handleSystemEvent", null);
exports.AdminEventStreamService = AdminEventStreamService = __decorate([
    (0, common_1.Injectable)()
], AdminEventStreamService);
//# sourceMappingURL=event-stream.service.js.map