import { PrismaService } from '../../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCompletionRates(): Promise<{
        totalGoals: number;
        completedGoals: number;
        completionRate: number;
    }>;
    getDepartmentAnalytics(): Promise<{
        departmentId: string;
        departmentName: string;
        totalGoals: number;
        completedGoals: number;
        completionRate: number;
    }[]>;
}
