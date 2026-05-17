import { AdminService } from './admin.service';
import { CreateCycleDto } from './dto/admin.dto';
import { AdminEventStreamService } from './event-stream.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EscalationService } from '../../escalation/escalation.service';
export declare class AdminController {
    private readonly adminService;
    private eventStreamService;
    private prisma;
    private escalationService;
    constructor(adminService: AdminService, eventStreamService: AdminEventStreamService, prisma: PrismaService, escalationService: EscalationService);
    triggerPendingApprovals(): Promise<{
        success: boolean;
        message: string;
    }>;
    triggerOverdueCheckins(): Promise<{
        success: boolean;
        message: string;
    }>;
    triggerStaleGoals(): Promise<{
        success: boolean;
        message: string;
    }>;
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
        sharedGoalId: string | null;
        progressScore: number;
        lockedAt: Date | null;
        version: number;
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
    getSystemEvents(limit?: string, offset?: string): import("./event-stream.service").SystemEvent[];
    getEventsByType(type: string, limit?: string): import("./event-stream.service").SystemEvent[];
    getSystemHealth(): Promise<{
        status: string;
        timestamp: Date;
        database: string;
        websocket: string;
        metrics: {
            userCount: number;
            goalCount: number;
            openEscalations: number;
            pendingApprovals: number;
        };
        services: {
            database: {
                status: string;
                latency: string;
            };
            websocket: {
                status: string;
                connections: number;
            };
            escalation: {
                status: string;
                lastCheck: Date;
            };
            webhooks: {
                status: string;
                deliveryRate: string;
            };
        };
        error?: undefined;
    } | {
        status: string;
        timestamp: Date;
        database: string;
        error: any;
        websocket?: undefined;
        metrics?: undefined;
        services?: undefined;
    }>;
    getOpenEscalations(): Promise<({
        target: {
            id: string;
            fullName: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        reason: string;
        level: number;
        targetId: string;
        initiatorId: string | null;
    })[]>;
    resolveEscalation(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getDashboardSummary(): Promise<{
        totalUsers: number;
        totalGoals: number;
        completedGoals: number;
        completionRate: string;
        openEscalations: number;
        pendingApprovals: number;
        recentEvents: import("./event-stream.service").SystemEvent[];
    }>;
}
