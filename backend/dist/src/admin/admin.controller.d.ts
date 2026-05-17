import { AdminEventStreamService } from './event-stream.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AdminController {
    private eventStreamService;
    private prisma;
    constructor(eventStreamService: AdminEventStreamService, prisma: PrismaService);
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
    getAuditLogs(limit?: string): Promise<({
        user: {
            id: string;
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
