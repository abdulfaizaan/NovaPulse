import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCheckinDto, ReviewCheckinDto } from './dto/checkin.dto';
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

  async review(checkinId: string, managerId: string, data: ReviewCheckinDto) {
    const checkin = await this.prisma.quarterlyCheckin.findUnique({
      where: { id: checkinId },
      include: { employee: true, goal: true },
    });

    if (!checkin) throw new NotFoundException('Check-in not found');
    if (checkin.employee.managerId !== managerId) {
      throw new ForbiddenException('You can only review check-ins of your direct reports');
    }

    // Update status
    const updatedCheckin = await this.prisma.quarterlyCheckin.update({
      where: { id: checkinId },
      data: {
        status: data.status,
      },
    });

    // Create a comment with the review notes if provided
    if (data.comment) {
      await this.prisma.comment.create({
        data: {
          content: `[Check-in Review: ${data.status}] ${data.comment}`,
          userId: managerId,
          checkinId: checkinId,
        },
      });
    }

    // If check-in is APPROVED, update goal's current achievement value
    if ((data.status as any) === 'APPROVED') {
      await this.prisma.goal.update({
        where: { id: checkin.goalId },
        data: {
          achievementValue: checkin.actualAchievement,
          progressScore: checkin.completionPercentage,
        },
      });
    }

    return updatedCheckin;
  }
}
