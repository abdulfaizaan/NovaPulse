import { AdminService } from './admin.service';
import { CreateCycleDto } from './dto/admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    unlockGoal(id: string): Promise<{
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
