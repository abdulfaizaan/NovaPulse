import { GoalStatus } from '../../../common/enums';
export declare class CreateGoalDto {
    title: string;
    description: string;
    thrustArea: string;
    unitOfMeasure: string;
    targetValue: number;
    weightage: number;
    dueDate: string;
    isShared?: boolean;
}
export declare class UpdateGoalDto {
    title?: string;
    description?: string;
    targetValue?: number;
    weightage?: number;
    status?: GoalStatus;
}
