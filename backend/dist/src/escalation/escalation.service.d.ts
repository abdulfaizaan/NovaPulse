import { PrismaService } from '../prisma/prisma.service';
import { EventsService } from '../events/events.service';
export declare class EscalationService {
    private prisma;
    private eventsService;
    private logger;
    constructor(prisma: PrismaService, eventsService: EventsService);
    checkPendingApprovals(): Promise<void>;
    checkOverdueCheckins(): Promise<void>;
    checkStaleGoals(): Promise<void>;
    dailyHealthCheck(): Promise<void>;
}
