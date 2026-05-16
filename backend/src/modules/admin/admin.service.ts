import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCycleDto } from './dto/admin.dto';
import { GoalStatus } from '../../common/enums';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createCycle(createCycleDto: CreateCycleDto) {
    if (createCycleDto.isActive) {
      // Deactivate all other cycles if this one is active
      await this.prisma.cycle.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    return this.prisma.cycle.create({
      data: {
        ...createCycleDto,
        startDate: new Date(createCycleDto.startDate),
        endDate: new Date(createCycleDto.endDate),
      }
    });
  }

  async getCycles() {
    return this.prisma.cycle.findMany();
  }

  async unlockGoal(goalId: string) {
    const goal = await this.prisma.goal.findUnique({ where: { id: goalId } });
    if (!goal) throw new BadRequestException('Goal not found');
    
    return this.prisma.goal.update({
      where: { id: goalId },
      data: { status: GoalStatus.REWORK_REQUESTED, lockedAt: null }
    });
  }

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { user: { select: { fullName: true, email: true } } }
    });
  }
}
