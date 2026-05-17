"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    configService;
    prisma;
    logger = new common_1.Logger(WebhooksService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    async sendDiscordWebhook(message, color = 0x6366f1) {
        const webhookUrl = this.configService.get('DISCORD_WEBHOOK_URL');
        if (!webhookUrl) {
            this.logger.warn('Discord webhook URL not configured');
            return;
        }
        try {
            await axios_1.default.post(webhookUrl, {
                embeds: [
                    {
                        description: message,
                        color: color,
                        timestamp: new Date().toISOString(),
                        footer: {
                            text: 'NovaPulse',
                            icon_url: 'https://novapulse.io/logo.png',
                        },
                    },
                ],
            });
            this.logger.log('Discord notification sent');
        }
        catch (error) {
            this.logger.error('Failed to send Discord webhook', error);
        }
    }
    async sendSlackWebhook(message, color = '#6366f1') {
        const webhookUrl = this.configService.get('SLACK_WEBHOOK_URL');
        if (!webhookUrl) {
            this.logger.warn('Slack webhook URL not configured');
            return;
        }
        try {
            await axios_1.default.post(webhookUrl, {
                attachments: [
                    {
                        text: message,
                        color: color,
                        ts: Math.floor(Date.now() / 1000),
                        footer: 'NovaPulse',
                        footer_icon: 'https://novapulse.io/logo.png',
                    },
                ],
            });
            this.logger.log('Slack notification sent');
        }
        catch (error) {
            this.logger.error('Failed to send Slack webhook', error);
        }
    }
    async sendTeamsWebhook(message, color = '6366f1') {
        const webhookUrl = this.configService.get('TEAMS_WEBHOOK_URL');
        if (!webhookUrl) {
            this.logger.warn('Teams webhook URL not configured');
            return;
        }
        try {
            await axios_1.default.post(webhookUrl, {
                '@type': 'MessageCard',
                '@context': 'https://schema.org/extensions',
                summary: 'NovaPulse Notification',
                themeColor: color,
                sections: [
                    {
                        text: message,
                    },
                ],
                potentialAction: [
                    {
                        '@type': 'OpenUri',
                        name: 'View in NovaPulse',
                        targets: [
                            {
                                os: 'default',
                                uri: `${this.configService.get('FRONTEND_URL')}/dashboard`,
                            },
                        ],
                    },
                ],
            });
            this.logger.log('Teams notification sent');
        }
        catch (error) {
            this.logger.error('Failed to send Teams webhook', error);
        }
    }
    async handleGoalSubmitted(event) {
        const message = `📌 **Goal Submitted**\n\n${event.actor.name} (${event.actor.email}) submitted a new goal:\n\`\`\`\n${event.data.title || 'Untitled'}\n\`\`\``;
        await Promise.all([
            this.sendDiscordWebhook(message, 0x3b82f6),
            this.sendSlackWebhook(message, '#3b82f6'),
            this.sendTeamsWebhook(message, '3b82f6'),
        ]);
    }
    async handleGoalApproved(event) {
        const message = `✅ **Goal Approved**\n\nGoal has been approved by manager.`;
        await Promise.all([
            this.sendDiscordWebhook(message, 0x10b981),
            this.sendSlackWebhook(message, '#10b981'),
            this.sendTeamsWebhook(message, '10b981'),
        ]);
    }
    async handleGoalRejected(event) {
        const message = `❌ **Goal Rework Requested**\n\nComment: ${event.data.comment || 'No comment'}`;
        await Promise.all([
            this.sendDiscordWebhook(message, 0xef4444),
            this.sendSlackWebhook(message, '#ef4444'),
            this.sendTeamsWebhook(message, 'ef4444'),
        ]);
    }
    async handleEscalationTriggered(event) {
        const message = `⚠️ **Escalation Triggered**\n\nType: ${event.data.entityType}\nReason: ${event.data.reason}`;
        await Promise.all([
            this.sendDiscordWebhook(message, 0xf59e0b),
            this.sendSlackWebhook(message, '#f59e0b'),
            this.sendTeamsWebhook(message, 'f59e0b'),
        ]);
    }
};
exports.WebhooksService = WebhooksService;
__decorate([
    (0, event_emitter_1.OnEvent)('goal.submitted'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksService.prototype, "handleGoalSubmitted", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.approved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksService.prototype, "handleGoalApproved", null);
__decorate([
    (0, event_emitter_1.OnEvent)('goal.rejected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksService.prototype, "handleGoalRejected", null);
__decorate([
    (0, event_emitter_1.OnEvent)('escalation.triggered'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksService.prototype, "handleEscalationTriggered", null);
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map