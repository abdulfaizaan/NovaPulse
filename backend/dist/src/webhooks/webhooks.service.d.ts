import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { DomainEvent } from '../events/events.service';
export declare class WebhooksService {
    private configService;
    private prisma;
    private logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    private sendDiscordWebhook;
    private sendSlackWebhook;
    private sendTeamsWebhook;
    handleGoalSubmitted(event: DomainEvent): Promise<void>;
    handleGoalApproved(event: DomainEvent): Promise<void>;
    handleGoalRejected(event: DomainEvent): Promise<void>;
    handleEscalationTriggered(event: DomainEvent): Promise<void>;
}
