import { PrismaService } from '../../prisma/prisma.service';
import { CreateCycleDto } from './dto/admin.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    createCycle(createCycleDto: CreateCycleDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }>;
    getCycles(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    }[]>;
    unlockGoal(goalId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        thrustArea: string;
        unitOfMeasure: string;
        targetValue: number;
        weightage: number;
        dueDate: Date;
        isShared: boolean;
        status: string;
        employeeId: string;
        achievementValue: number;
        progressScore: number;
        lockedAt: Date | null;
        version: number;
        sharedGoalId: string | null;
    }>;
    getAuditLogs(): Promise<({
        user: {
            fullName: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        entityType: string;
        entityId: string;
        action: string;
        beforeValue: string | null;
        afterValue: string | null;
        userId: string | null;
    })[]>;
}
