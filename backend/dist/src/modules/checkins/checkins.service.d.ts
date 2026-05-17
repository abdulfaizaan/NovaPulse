import { PrismaService } from '../../prisma/prisma.service';
import { CreateCheckinDto, ReviewCheckinDto } from './dto/checkin.dto';
import { Role } from '../../common/enums';
export declare class CheckinsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(employeeId: string, createCheckinDto: CreateCheckinDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        employeeId: string;
        goalId: string;
        cycleId: string;
        plannedTarget: number;
        actualAchievement: number;
        notes: string | null;
        completionPercentage: number;
    }>;
    findByGoal(goalId: string, userId: string, role: Role): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        employeeId: string;
        goalId: string;
        cycleId: string;
        plannedTarget: number;
        actualAchievement: number;
        notes: string | null;
        completionPercentage: number;
    }[]>;
    review(checkinId: string, managerId: string, data: ReviewCheckinDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        employeeId: string;
        goalId: string;
        cycleId: string;
        plannedTarget: number;
        actualAchievement: number;
        notes: string | null;
        completionPercentage: number;
    }>;
}
