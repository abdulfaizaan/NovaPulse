import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { DomainEvent } from '../events/events.service';

@Injectable()
export class WebhooksService {
  private logger = new Logger(WebhooksService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  private async sendDiscordWebhook(message: string, color: number = 0x6366f1) {
    const webhookUrl = this.configService.get<string>('DISCORD_WEBHOOK_URL');
    if (!webhookUrl) {
      this.logger.warn('Discord webhook URL not configured');
      return;
    }

    try {
      await axios.post(webhookUrl, {
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
    } catch (error) {
      this.logger.error('Failed to send Discord webhook', error);
    }
  }

  private async sendSlackWebhook(message: string, color: string = '#6366f1') {
    const webhookUrl = this.configService.get<string>('SLACK_WEBHOOK_URL');
    if (!webhookUrl) {
      this.logger.warn('Slack webhook URL not configured');
      return;
    }

    try {
      await axios.post(webhookUrl, {
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
    } catch (error) {
      this.logger.error('Failed to send Slack webhook', error);
    }
  }

  private async sendTeamsWebhook(message: string, color: string = '6366f1') {
    const webhookUrl = this.configService.get<string>('TEAMS_WEBHOOK_URL');
    if (!webhookUrl) {
      this.logger.warn('Teams webhook URL not configured');
      return;
    }

    try {
      await axios.post(webhookUrl, {
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
    } catch (error) {
      this.logger.error('Failed to send Teams webhook', error);
    }
  }

  @OnEvent('goal.submitted')
  async handleGoalSubmitted(event: DomainEvent) {
    const message = `📌 **Goal Submitted**\n\n${event.actor.name} (${event.actor.email}) submitted a new goal:\n\`\`\`\n${event.data.title || 'Untitled'}\n\`\`\``;
    
    await Promise.all([
      this.sendDiscordWebhook(message, 0x3b82f6),
      this.sendSlackWebhook(message, '#3b82f6'),
      this.sendTeamsWebhook(message, '3b82f6'),
    ]);
  }

  @OnEvent('goal.approved')
  async handleGoalApproved(event: DomainEvent) {
    const message = `✅ **Goal Approved**\n\nGoal has been approved by manager.`;
    
    await Promise.all([
      this.sendDiscordWebhook(message, 0x10b981),
      this.sendSlackWebhook(message, '#10b981'),
      this.sendTeamsWebhook(message, '10b981'),
    ]);
  }

  @OnEvent('goal.rejected')
  async handleGoalRejected(event: DomainEvent) {
    const message = `❌ **Goal Rework Requested**\n\nComment: ${event.data.comment || 'No comment'}`;
    
    await Promise.all([
      this.sendDiscordWebhook(message, 0xef4444),
      this.sendSlackWebhook(message, '#ef4444'),
      this.sendTeamsWebhook(message, 'ef4444'),
    ]);
  }

  @OnEvent('escalation.triggered')
  async handleEscalationTriggered(event: DomainEvent) {
    const message = `⚠️ **Escalation Triggered**\n\nType: ${event.data.entityType}\nReason: ${event.data.reason}`;
    
    await Promise.all([
      this.sendDiscordWebhook(message, 0xf59e0b),
      this.sendSlackWebhook(message, '#f59e0b'),
      this.sendTeamsWebhook(message, 'f59e0b'),
    ]);
  }
}
