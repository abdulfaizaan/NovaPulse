import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCheckinDto } from './dto/checkin.dto';
import { Role } from '../../common/enums';

@Injectable()
export class CheckinsService {
  constructor(private prisma: PrismaService) {}

  async create(employeeId: string, createCheckinDto: CreateCheckinDto) {
    const goal = await this.prisma.goal.findUnique({
      where: { id: createCheckinDto.goalId }
    });

    if (!goal || goal.employeeId !== employeeId) {
      throw new ForbiddenException('Cannot check in on a goal you do not own');
    }

    const cycle = await this.prisma.cycle.findUnique({
      where: { id: createCheckinDto.cycleId }
    });

    if (!cycle || !cycle.isActive) {
      throw new BadRequestException('Cycle is not active');
    }

    // Auto calculate completion percentage
    let completionPercentage = 0;
    if (createCheckinDto.plannedTarget > 0) {
      completionPercentage = (createCheckinDto.actualAchievement / createCheckinDto.plannedTarget) * 100;
    }
    
    // Cap at 100% just in case, depending on business rules
    if (completionPercentage > 100) completionPercentage = 100;

    return this.prisma.quarterlyCheckin.create({
      data: {
        ...createCheckinDto,
        employeeId,
        completionPercentage,
      }
    });
  }

  async findByGoal(goalId: string, userId: string, role: Role) {
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
      include: { employee: true }
    });

    if (!goal) throw new NotFoundException('Goal not found');

    if (role === Role.EMPLOYEE && goal.employeeId !== userId) {
      throw new ForbiddenException();
    }
    if (role === Role.MANAGER && goal.employee.managerId !== userId) {
      throw new ForbiddenException();
    }

    return this.prisma.quarterlyCheckin.findMany({
      where: { goalId }
    });
  }
}
