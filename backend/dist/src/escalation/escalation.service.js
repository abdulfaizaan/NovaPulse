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
var EscalationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscalationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const events_service_1 = require("../events/events.service");
let EscalationService = EscalationService_1 = class EscalationService {
    prisma;
    eventsService;
    logger = new common_1.Logger(EscalationService_1.name);
    constructor(prisma, eventsService) {
        this.prisma = prisma;
        this.eventsService = eventsService;
    }
    async checkPendingApprovals() {
        this.logger.log('[CRON] Starting pending approvals check...');
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const pendingGoals = await this.prisma.goal.findMany({
            where: {
                status: 'submitted',
                createdAt: {
                    lt: sevenDaysAgo,
                },
            },
            include: {
                employee: true,
                approvals: true,
            },
        });
        for (const goal of pendingGoals) {
            this.logger.log(`[CRON] Escalating goal ${goal.id} pending for > 7 days`);
            await this.prisma.escalation.create({
                data: {
                    reason: 'Goal pending approval for more than 7 days',
                    level: 2,
                    targetId: goal.employee.managerId || goal.employeeId,
                    status: 'OPEN',
                },
            });
            await this.eventsService.emitEscalationTriggered(goal.id, 'Goal', goal.id, 'Goal pending approval for more than 7 days', null);
        }
        this.logger.log(`[CRON] Pending approvals check completed. Escalated ${pendingGoals.length} goals.`);
    }
    async checkOverdueCheckins() {
        this.logger.log('[CRON] Starting overdue check-ins check...');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const overdueCheckins = await this.prisma.quarterlyCheckin.findMany({
            where: {
                status: {
                    in: ['DRAFT', 'PENDING'],
                },
                cycle: {
                    endDate: {
                        lt: today,
                    },
                },
            },
            include: {
                employee: true,
                goal: true,
            },
        });
        for (const checkin of overdueCheckins) {
            this.logger.log(`[CRON] Escalating overdue check-in ${checkin.id}`);
            await this.prisma.escalation.create({
                data: {
                    reason: `Check-in for goal "${checkin.goal.title}" is overdue`,
                    level: 1,
                    targetId: checkin.employeeId,
                    status: 'OPEN',
                },
            });
            await this.eventsService.emitEscalationTriggered(checkin.id, 'QuarterlyCheckin', checkin.id, `Check-in for goal "${checkin.goal.title}" is overdue`, null);
        }
        this.logger.log(`[CRON] Overdue check-ins check completed. Escalated ${overdueCheckins.length} check-ins.`);
    }
    async checkStaleGoals() {
        this.logger.log('[CRON] Starting stale goals check...');
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const staleGoals = await this.prisma.goal.findMany({
            where: {
                status: 'locked',
                updatedAt: {
                    lt: thirtyDaysAgo,
                },
            },
            include: {
                employee: true,
            },
        });
        for (const goal of staleGoals) {
            this.logger.log(`[CRON] Escalating stale goal ${goal.id}`);
            await this.prisma.escalation.create({
                data: {
                    reason: 'No progress updates in 30+ days',
                    level: 1,
                    targetId: goal.employee.managerId || goal.employeeId,
                    status: 'OPEN',
                },
            });
            await this.eventsService.emitEscalationTriggered(goal.id, 'Goal', goal.id, 'No progress updates in 30+ days', null);
        }
        this.logger.log(`[CRON] Stale goals check completed. Escalated ${staleGoals.length} goals.`);
    }
    async dailyHealthCheck() {
        this.logger.log('[CRON] Running daily health check...');
        try {
            const dbHealthy = await this.prisma.$queryRaw `SELECT 1`;
            const userCount = await this.prisma.user.count();
            const goalCount = await this.prisma.goal.count();
            const openEscalations = await this.prisma.escalation.count({
                where: { status: 'OPEN' },
            });
            this.logger.log(`[CRON] Health check passed. Users: ${userCount}, Goals: ${goalCount}, Open Escalations: ${openEscalations}`);
            await this.eventsService.emitSystemEvent('SYSTEM_HEALTH_CHECK', {
                database: 'healthy',
                timestamp: new Date(),
                metrics: {
                    userCount,
                    goalCount,
                    openEscalations,
                },
            });
        }
        catch (error) {
            this.logger.error('[CRON] Health check failed', error);
            await this.eventsService.emitSystemEvent('SYSTEM_HEALTH_CHECK_FAILED', {
                database: 'unhealthy',
                error: error.message,
                timestamp: new Date(),
            });
        }
    }
};
exports.EscalationService = EscalationService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EscalationService.prototype, "checkPendingApprovals", null);
__decorate([
    (0, schedule_1.Cron)('0 8 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EscalationService.prototype, "checkOverdueCheckins", null);
__decorate([
    (0, schedule_1.Cron)('0 10 * * 3'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EscalationService.prototype, "checkStaleGoals", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EscalationService.prototype, "dailyHealthCheck", null);
exports.EscalationService = EscalationService = EscalationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_service_1.EventsService])
], EscalationService);
//# sourceMappingURL=escalation.service.js.map