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
exports.CheckinsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const enums_1 = require("../../common/enums");
let CheckinsService = class CheckinsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(employeeId, createCheckinDto) {
        const goal = await this.prisma.goal.findUnique({
            where: { id: createCheckinDto.goalId }
        });
        if (!goal || goal.employeeId !== employeeId) {
            throw new common_1.ForbiddenException('Cannot check in on a goal you do not own');
        }
        const cycle = await this.prisma.cycle.findUnique({
            where: { id: createCheckinDto.cycleId }
        });
        if (!cycle || !cycle.isActive) {
            throw new common_1.BadRequestException('Cycle is not active');
        }
        let completionPercentage = 0;
        if (createCheckinDto.plannedTarget > 0) {
            completionPercentage = (createCheckinDto.actualAchievement / createCheckinDto.plannedTarget) * 100;
        }
        if (completionPercentage > 100)
            completionPercentage = 100;
        return this.prisma.quarterlyCheckin.create({
            data: {
                ...createCheckinDto,
                employeeId,
                completionPercentage,
            }
        });
    }
    async findByGoal(goalId, userId, role) {
        const goal = await this.prisma.goal.findUnique({
            where: { id: goalId },
            include: { employee: true }
        });
        if (!goal)
            throw new common_1.NotFoundException('Goal not found');
        if (role === enums_1.Role.EMPLOYEE && goal.employeeId !== userId) {
            throw new common_1.ForbiddenException();
        }
        if (role === enums_1.Role.MANAGER && goal.employee.managerId !== userId) {
            throw new common_1.ForbiddenException();
        }
        return this.prisma.quarterlyCheckin.findMany({
            where: { goalId }
        });
    }
};
exports.CheckinsService = CheckinsService;
exports.CheckinsService = CheckinsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CheckinsService);
//# sourceMappingURL=checkins.service.js.map