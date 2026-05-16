import { CheckinsService } from './checkins.service';
import { CreateCheckinDto } from './dto/checkin.dto';
export declare class CheckinsController {
    private readonly checkinsService;
    constructor(checkinsService: CheckinsService);
    create(user: any, createCheckinDto: CreateCheckinDto): Promise<{
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
    findByGoal(goalId: string, user: any): Promise<{
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
}
