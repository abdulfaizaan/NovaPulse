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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GoalsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
let GoalsGateway = GoalsGateway_1 = class GoalsGateway {
    prisma;
    server;
    constructor(prisma) {
        this.prisma = prisma;
    }
    logger = new common_1.Logger(GoalsGateway_1.name);
    userSockets = new Map();
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId)?.add(client.id);
            this.logger.log(`User ${userId} connected: ${client.id}`);
        }
    }
    handleDisconnect(client) {
        const userId = client.handshake.query.userId;
        if (userId && this.userSockets.has(userId)) {
            this.userSockets.get(userId)?.delete(client.id);
            if (this.userSockets.get(userId)?.size === 0) {
                this.userSockets.delete(userId);
            }
            this.logger.log(`User ${userId} disconnected: ${client.id}`);
        }
    }
    handlePing(client) {
        client.emit('pong');
    }
    async handleGoalCreated(event) {
        this.broadcastToTeam(event.data.employeeId, 'goal:created', event);
        const employee = await this.prisma.user.findUnique({
            where: { id: event.data.employeeId },
            select: { managerId: true }
        });
        if (employee?.managerId) {
            this.broadcastToTeam(employee.managerId, 'goal:created', event);
        }
    }
    async handleGoalSubmitted(event) {
        this.broadcastToTeam(event.data.employeeId, 'goal:submitted', event);
        const goal = await this.prisma.goal.findUnique({
            where: { id: event.aggregateId },
            include: { employee: true }
        });
        if (goal?.employee?.managerId) {
            this.broadcastToTeam(goal.employee.managerId, 'goal:submitted', event);
        }
    }
    async handleGoalApproved(event) {
        const goal = await this.prisma.goal.findUnique({
            where: { id: event.aggregateId },
            select: { employeeId: true }
        });
        if (goal?.employeeId) {
            this.broadcastToTeam(goal.employeeId, 'goal:approved', event);
            this.broadcastToTeam(event.actor.id, 'goal:approved', event);
        }
    }
    async handleGoalRejected(event) {
        const goal = await this.prisma.goal.findUnique({
            where: { id: event.aggregateId },
            select: { employeeId: true }
        });
        if (goal?.employeeId) {
            this.broadcastToTeam(goal.employeeId, 'goal:rejected', event);
            this.broadcastToTeam(event.actor.id, 'goal:rejected', event);
        }
    }
    handleEscalationTriggered(event) {
        this.server.emit('escalation:triggered', event);
    }
    handleSystemEvent(event) {
        this.server.emit('system:event', event);
    }
    broadcastToTeam(userId, eventType, data) {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.forEach((socketId) => {
                this.server.to(socketId).emit(eventType, data);
            });
        }
    }
    broadcastToAll(eventType, data) {
        this.server.emit(eventType, data);
    }
    broadcastToUser(userId, eventType, data) {
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.forEach((socketId) => {
                this.server.to(socketId).emit(eventType, data);
            });
        }
    }
};
exports.GoalsGateway = GoalsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GoalsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GoalsGateway.prototype, "handlePing", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoalsGateway.prototype, "handleGoalCreated", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.submitted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoalsGateway.prototype, "handleGoalSubmitted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.approved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoalsGateway.prototype, "handleGoalApproved", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.rejected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GoalsGateway.prototype, "handleGoalRejected", null);
__decorate([
    (0, event_emitter_1.OnEvent)('escalation.triggered'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsGateway.prototype, "handleEscalationTriggered", null);
__decorate([
    (0, event_emitter_1.OnEvent)('system.event'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsGateway.prototype, "handleSystemEvent", null);
exports.GoalsGateway = GoalsGateway = GoalsGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true,
        },
        namespace: '/ws',
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GoalsGateway);
//# sourceMappingURL=goals.gateway.js.map