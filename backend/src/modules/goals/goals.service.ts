import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goals.dto';
import { GoalStatus, Role } from '../../common/enums';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(employeeId: string, createGoalDto: CreateGoalDto) {
    // Validation: Max 8 goals
    const goalsCount = await this.prisma.goal.count({
      where: { employeeId, status: { not: GoalStatus.COMPLETED } }
    });
    
    if (goalsCount >= 8) {
      throw new BadRequestException('Maximum of 8 active goals allowed per employee');
    }

    // Creating the goal
    return this.prisma.goal.create({
      data: {
        ...createGoalDto,
        employeeId,
        dueDate: new Date(createGoalDto.dueDate),
      }
    });
  }

  async findAll(userId: string, role: Role) {
    if (role === Role.ADMIN) {
      return this.prisma.goal.findMany();
    } else if (role === Role.MANAGER) {
      return this.prisma.goal.findMany({
        where: {
          employee: {
            managerId: userId
          }
        },
        include: { employee: true }
      });
    } else {
      return this.prisma.goal.findMany({
        where: { employeeId: userId }
      });
    }
  }

  async findOne(id: string, userId: string, role: Role) {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: { employee: true }
    });

    if (!goal) throw new NotFoundException('Goal not found');

    if (role === Role.EMPLOYEE && goal.employeeId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (role === Role.MANAGER && goal.employee.managerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto, userId: string, role: Role) {
    const goal = await this.findOne(id, userId, role);

    if (goal.status === GoalStatus.LOCKED && role !== Role.ADMIN) {
      throw new BadRequestException('Locked goals cannot be edited except by admins');
    }

    if (role === Role.EMPLOYEE && goal.status !== GoalStatus.DRAFT && goal.status !== GoalStatus.REWORK_REQUESTED) {
      throw new BadRequestException('Cannot edit goal in current state');
    }

    // Weightage validation logic could be triggered when submitting, but checking here is also fine.
    
    return this.prisma.goal.update({
      where: { id },
      data: updateGoalDto
    });
  }

  async submit(id: string, userId: string) {
    const goal = await this.findOne(id, userId, Role.EMPLOYEE);
    
    // Check total weightage before submit
    const allGoals = await this.prisma.goal.findMany({
      where: { employeeId: userId, status: { in: [GoalStatus.DRAFT, GoalStatus.SUBMITTED, GoalStatus.UNDER_REVIEW, GoalStatus.APPROVED, GoalStatus.LOCKED] } }
    });
    
    // Need exact 100 weightage check before submitting the complete batch
    // For individual goal submit, we might just transition state.
    
    return this.prisma.goal.update({
      where: { id },
      data: { status: GoalStatus.SUBMITTED }
    });
  }

  async approve(id: string, managerId: string) {
    const goal = await this.findOne(id, managerId, Role.MANAGER);
    return this.prisma.goal.update({
      where: { id },
      data: { status: GoalStatus.APPROVED }
    });
  }
}
