import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, user } = req;
    
    // Only log mutations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async (response) => {
          try {
            // Determine entity type based on URL mapping
            let entityType = 'UNKNOWN';
            if (url.includes('/goals')) entityType = 'GOAL';
            else if (url.includes('/checkins')) entityType = 'CHECKIN';
            else if (url.includes('/users')) entityType = 'USER';
            
            // Extract ID if present in the response or URL
            const entityId = response?.id || req.params?.id || 'N/A';
            
            await this.prisma.auditLog.create({
              data: {
                userId: user?.id,
                entityType,
                entityId,
                action: method,
                afterValue: response ? JSON.parse(JSON.stringify(response)) : null,
                // Before value logic usually requires querying the DB before the action,
                // which is better suited for specific services or a custom decorator/interceptor per entity.
                // For global interceptor, we mostly log the result.
              }
            });
          } catch (e) {
            console.error('Failed to create audit log', e);
          }
        }),
      );
    }
    return next.handle();
  }
}
