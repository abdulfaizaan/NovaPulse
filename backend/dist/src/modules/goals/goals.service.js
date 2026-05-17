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
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const enums_1 = require("../../common/enums");
const events_service_1 = require("../../events/events.service");
let GoalsService = class GoalsService {
    prisma;
    eventsService;
    constructor(prisma, eventsService) {
        this.prisma = prisma;
        this.eventsService = eventsService;
    }
    async create(employeeId, createGoalDto) {
        const goalsCount = await this.prisma.goal.count({
            where: { employeeId, status: { not: enums_1.GoalStatus.COMPLETED } }
        });
        if (goalsCount >= 8) {
            throw new common_1.BadRequestException('Maximum of 8 active goals allowed per employee');
        }
        const goal = await this.prisma.goal.create({
            data: {
                ...createGoalDto,
                employeeId,
                dueDate: new Date(createGoalDto.dueDate),
            },
            include: { employee: true },
        });
        const actor = await this.prisma.user.findUnique({ where: { id: employeeId } });
        await this.eventsService.emitGoalCreated(goal.id, employeeId, goal, actor);
        return goal;
    }
    async findAll(userId, role) {
        if (role === enums_1.Role.ADMIN) {
            return this.prisma.goal.findMany({ include: { employee: true } });
        }
        else if (role === enums_1.Role.MANAGER) {
            return this.prisma.goal.findMany({
                where: {
                    employee: {
                        managerId: userId
                    }
                },
                include: { employee: true }
            });
        }
        else {
            return this.prisma.goal.findMany({
                where: { employeeId: userId },
                include: { employee: true },
            });
        }
    }
    async findOne(id, userId, role) {
        const goal = await this.prisma.goal.findUnique({
            where: { id },
            include: { employee: true }
        });
        if (!goal)
            throw new common_1.NotFoundException('Goal not found');
        if (role === enums_1.Role.EMPLOYEE && goal.employeeId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (role === enums_1.Role.MANAGER && goal.employee.managerId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return goal;
    }
    async update(id, updateGoalDto, userId, role) {
        const goal = await this.findOne(id, userId, role);
        if (goal.status === enums_1.GoalStatus.LOCKED && role !== enums_1.Role.ADMIN) {
            throw new common_1.BadRequestException('Locked goals cannot be edited except by admins');
        }
        if (role === enums_1.Role.EMPLOYEE && goal.status !== enums_1.GoalStatus.DRAFT && goal.status !== enums_1.GoalStatus.REWORK_REQUESTED) {
            throw new common_1.BadRequestException('Cannot edit goal in current state');
        }
        return this.prisma.goal.update({
            where: { id },
            data: { ...updateGoalDto,
                version: { increment: 1 }
            },
            include: { employee: true },
        });
    }
    async submit(id, userId) {
        const goal = await this.findOne(id, userId, enums_1.Role.EMPLOYEE);
        const allGoals = await this.prisma.goal.findMany({
            where: { employeeId: userId, status: { in: [enums_1.GoalStatus.DRAFT, enums_1.GoalStatus.SUBMITTED, enums_1.GoalStatus.UNDER_REVIEW, enums_1.GoalStatus.APPROVED, enums_1.GoalStatus.LOCKED] } }
        });
        const updatedGoal = await this.prisma.goal.update({
            where: { id },
            data: { status: enums_1.GoalStatus.SUBMITTED },
            include: { employee: true },
        });
        const actor = await this.prisma.user.findUnique({ where: { id: userId } });
        await this.eventsService.emitGoalSubmitted(id, userId, actor);
        return updatedGoal;
    }
    async approve(id, managerId) {
        const goal = await this.findOne(id, managerId, enums_1.Role.MANAGER);
        if (goal.employeeId === managerId) {
            throw new common_1.ForbiddenException('Enterprise Compliance: Users cannot approve their own goals.');
        }
        const updatedGoal = await this.prisma.goal.update({
            where: { id },
            data: { status: enums_1.GoalStatus.APPROVED },
            include: { employee: true },
        });
        const actor = await this.prisma.user.findUnique({ where: { id: managerId } });
        await this.eventsService.emitGoalApproved(id, managerId, actor);
        return updatedGoal;
    }
    async reject(id, managerId, comment) {
        const goal = await this.findOne(id, managerId, enums_1.Role.MANAGER);
        const updatedGoal = await this.prisma.goal.update({
            where: { id },
            data: { status: enums_1.GoalStatus.REWORK_REQUESTED },
            include: { employee: true },
        });
        const actor = await this.prisma.user.findUnique({ where: { id: managerId } });
        await this.eventsService.emitGoalRejected(id, managerId, comment, actor);
        return updatedGoal;
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_service_1.EventsService])
], GoalsService);
//# sourceMappingURL=goals.service.js.map