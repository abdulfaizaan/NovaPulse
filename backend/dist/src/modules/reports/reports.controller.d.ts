import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
