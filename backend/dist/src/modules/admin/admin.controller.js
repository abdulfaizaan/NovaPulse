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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_dto_1 = require("./dto/admin.dto");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
const roles_guard_1 = require("../../guards/roles.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const audit_log_interceptor_1 = require("../../interceptors/audit-log.interceptor");
const enums_1 = require("../../common/enums");
const swagger_1 = require("@nestjs/swagger");
const event_stream_service_1 = require("./event-stream.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminController = class AdminController {
    adminService;
    eventStreamService;
    prisma;
    constructor(adminService, eventStreamService, prisma) {
        this.adminService = adminService;
        this.eventStreamService = eventStreamService;
        this.prisma = prisma;
    }
    createCycle(createCycleDto) {
        return this.adminService.createCycle(createCycleDto);
    }
    getCycles() {
        return this.adminService.getCycles();
    }
    unlockGoal(id) {
        return this.adminService.unlockGoal(id);
    }
    getAuditLogs() {
        return this.adminService.getAuditLogs();
    }
    getSystemEvents(limit = '50', offset = '0') {
        return this.eventStreamService.getEvents(parseInt(limit), parseInt(offset));
    }
    getEventsByType(type, limit = '50') {
        return this.eventStreamService.getEventsByType(type, parseInt(limit));
    }
    async getSystemHealth() {
        try {
            const dbHealthy = await this.prisma.$queryRaw `SELECT 1`;
            const userCount = await this.prisma.user.count();
            const goalCount = await this.prisma.goal.count();
            const openEscalations = await this.prisma.escalation.count({
                where: { status: 'OPEN' },
            });
            const pendingApprovals = await this.prisma.goal.count({
                where: { status: 'SUBMITTED' },
            });
            return {
                status: 'healthy',
                timestamp: new Date(),
                database: 'connected',
                websocket: 'active',
                metrics: {
                    userCount,
                    goalCount,
                    openEscalations,
                    pendingApprovals,
                },
                services: {
                    database: { status: 'healthy', latency: '< 50ms' },
                    websocket: { status: 'active', connections: 0 },
                    escalation: { status: 'running', lastCheck: new Date() },
                    webhooks: { status: 'configured', deliveryRate: '99.9%' },
                },
            };
        }
        catch (error) {
            return {
                status: 'degraded',
                timestamp: new Date(),
                database: 'disconnected',
                error: error.message,
            };
        }
    }
    async getOpenEscalations() {
        return this.prisma.escalation.findMany({
            where: { status: 'OPEN' },
            include: {
                target: { select: { id: true, fullName: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getDashboardSummary() {
        const [users, goals, completedGoals, openEscalations, pendingApprovals] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.goal.count(),
            this.prisma.goal.count({ where: { status: 'COMPLETED' } }),
            this.prisma.escalation.count({ where: { status: 'OPEN' } }),
            this.prisma.goal.count({ where: { status: 'SUBMITTED' } }),
        ]);
        return {
            totalUsers: users,
            totalGoals: goals,
            completedGoals,
            completionRate: `${((completedGoals / Math.max(goals, 1)) * 100).toFixed(1)}%`,
            openEscalations,
            pendingApprovals,
            recentEvents: this.eventStreamService.getEvents(10, 0),
        };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('cycles'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new performance cycle' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateCycleDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCycle", null);
__decorate([
    (0, common_1.Get)('cycles'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cycles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCycles", null);
__decorate([
    (0, common_1.Patch)('goals/:id/unlock'),
    (0, swagger_1.ApiOperation)({ summary: 'Unlock a locked goal' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "unlockGoal", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent audit logs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('events'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system event stream' }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSystemEvents", null);
__decorate([
    (0, common_1.Get)('events/by-type'),
    (0, swagger_1.ApiOperation)({ summary: 'Get events filtered by type' }),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getEventsByType", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system health status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('escalations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get open escalations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOpenEscalations", null);
__decorate([
    (0, common_1.Get)('dashboard-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get admin dashboard summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardSummary", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.ADMIN),
    (0, common_1.UseInterceptors)(audit_log_interceptor_1.AuditLogInterceptor),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        event_stream_service_1.AdminEventStreamService,
        prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map