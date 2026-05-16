import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Note: Prisma 5+ handles shutdown hooks automatically, but we keep this for backwards compatibility
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
