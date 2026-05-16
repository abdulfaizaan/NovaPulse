import { CheckInStatus } from '../../../common/enums';
export declare class CreateCheckinDto {
    goalId: string;
    cycleId: string;
    plannedTarget: number;
    actualAchievement: number;
    status: CheckInStatus;
    notes?: string;
}
