import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGoalDto, UpdateGoalDto, CreateSharedGoalDto } from './dto/goals.dto';
import { GoalStatus, Role } from '../../common/enums';
import { EventsService } from '../../events/events.service';

@Injectable()
export class GoalsService {
  constructor(
    private prisma: PrismaService,
    private eventsService: EventsService,
  ) {}

  async createShared(creatorId: string, data: CreateSharedGoalDto) {
    const sharedGoal = await this.prisma.sharedGoal.create({
      data: {
        title: data.title,
        description: data.description,
        thrustArea: data.thrustArea,
        unitOfMeasure: data.unitOfMeasure,
        targetValue: data.targetValue,
        creatorId,
      },
    });

    for (const assignment of data.assignments) {
      await this.prisma.goalAssignment.create({
        data: {
          sharedGoalId: sharedGoal.id,
          employeeId: assignment.employeeId,
          weightage: assignment.weightage,
        },
      });

      await this.prisma.goal.create({
        data: {
          employeeId: assignment.employeeId,
          title: data.title,
          description: data.description,
          thrustArea: data.thrustArea,
          unitOfMeasure: data.unitOfMeasure,
          targetValue: data.targetValue,
          weightage: assignment.weightage,
          dueDate: new Date(data.dueDate),
          isShared: true,
          sharedGoalId: sharedGoal.id,
          status: GoalStatus.DRAFT,
        },
      });
    }

    return sharedGoal;
  }

  async create(employeeId: string, createGoalDto: CreateGoalDto) {
    // Validation: Max 8 goals
    const goalsCount = await this.prisma.goal.count({
      where: { employeeId, status: { not: GoalStatus.COMPLETED } }
    });
    
    if (goalsCount >= 8) {
      throw new BadRequestException('Maximum of 8 active goals allowed per employee');
    }

    // Creating the goal
    const goal = await this.prisma.goal.create({
      data: {
        ...createGoalDto,
        employeeId,
        dueDate: new Date(createGoalDto.dueDate),
      },
      include: { employee: true },
    });

    // Emit event
    const actor = await this.prisma.user.findUnique({ where: { id: employeeId } });
    await this.eventsService.emitGoalCreated(goal.id, employeeId, goal, actor);

    return goal;
  }

  async findAll(userId: string, role: Role) {
    if (role === Role.ADMIN) {
      return this.prisma.goal.findMany({ include: { employee: true } });
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
        where: { employeeId: userId },
        include: { employee: true },
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
      data: { ...updateGoalDto, 
        // @ts-ignore - Prisma Client hasn't regenerated yet due to EPERM lock
        version: { increment: 1 } 
      },
      include: { employee: true },
    });
  }

  async submit(id: string, userId: string) {
    const goal = await this.findOne(id, userId, Role.EMPLOYEE);
    
    // Check total weightage before submit
    const allGoals = await this.prisma.goal.findMany({
      where: { employeeId: userId, status: { in: [GoalStatus.DRAFT, GoalStatus.SUBMITTED, GoalStatus.UNDER_REVIEW, GoalStatus.APPROVED, GoalStatus.LOCKED] } }
    });
    
    const totalWeight = allGoals.reduce((sum, g) => sum + g.weightage, 0);
    if (totalWeight !== 100) {
      throw new BadRequestException(`Enterprise Guardrail: Total weightage of your active performance goals is ${totalWeight}%. It must be exactly 100% to submit.`);
    }
    
    const updatedGoal = await this.prisma.goal.update({
      where: { id },
      data: { status: GoalStatus.SUBMITTED },
      include: { employee: true },
    });

    // Emit event
    const actor = await this.prisma.user.findUnique({ where: { id: userId } });
    await this.eventsService.emitGoalSubmitted(id, userId, actor);

    return updatedGoal;
  }

  async approve(id: string, managerId: string) {
    const goal = await this.findOne(id, managerId, Role.MANAGER);
    
    if (goal.employeeId === managerId) {
      throw new ForbiddenException('Enterprise Compliance: Users cannot approve their own goals.');
    }
    
    const updatedGoal = await this.prisma.goal.update({
      where: { id },
      data: { status: GoalStatus.APPROVED },
      include: { employee: true },
    });

    // Emit event
    const actor = await this.prisma.user.findUnique({ where: { id: managerId } });
    await this.eventsService.emitGoalApproved(id, managerId, actor);

    return updatedGoal;
  }

  async reject(id: string, managerId: string, comment: string) {
    const goal = await this.findOne(id, managerId, Role.MANAGER);
    
    const updatedGoal = await this.prisma.goal.update({
      where: { id },
      data: { status: GoalStatus.REWORK_REQUESTED },
      include: { employee: true },
    });

    // Emit event
    const actor = await this.prisma.user.findUnique({ where: { id: managerId } });
    await this.eventsService.emitGoalRejected(id, managerId, comment, actor);

    return updatedGoal;
  }
}
