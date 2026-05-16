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
let GoalsService = class GoalsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(employeeId, createGoalDto) {
        const goalsCount = await this.prisma.goal.count({
            where: { employeeId, status: { not: enums_1.GoalStatus.COMPLETED } }
        });
        if (goalsCount >= 8) {
            throw new common_1.BadRequestException('Maximum of 8 active goals allowed per employee');
        }
        return this.prisma.goal.create({
            data: {
                ...createGoalDto,
                employeeId,
                dueDate: new Date(createGoalDto.dueDate),
            }
        });
    }
    async findAll(userId, role) {
        if (role === enums_1.Role.ADMIN) {
            return this.prisma.goal.findMany();
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
                where: { employeeId: userId }
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
            data: updateGoalDto
        });
    }
    async submit(id, userId) {
        const goal = await this.findOne(id, userId, enums_1.Role.EMPLOYEE);
        const allGoals = await this.prisma.goal.findMany({
            where: { employeeId: userId, status: { in: [enums_1.GoalStatus.DRAFT, enums_1.GoalStatus.SUBMITTED, enums_1.GoalStatus.UNDER_REVIEW, enums_1.GoalStatus.APPROVED, enums_1.GoalStatus.LOCKED] } }
        });
        return this.prisma.goal.update({
            where: { id },
            data: { status: enums_1.GoalStatus.SUBMITTED }
        });
    }
    async approve(id, managerId) {
        const goal = await this.findOne(id, managerId, enums_1.Role.MANAGER);
        return this.prisma.goal.update({
            where: { id },
            data: { status: enums_1.GoalStatus.APPROVED }
        });
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GoalsService);
//# sourceMappingURL=goals.service.js.map