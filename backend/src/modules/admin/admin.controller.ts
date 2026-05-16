import { Controller, Get, Post, Body, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateCycleDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { AuditLogInterceptor } from '../../interceptors/audit-log.interceptor';
import { Role } from '../../common/enums';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@UseInterceptors(AuditLogInterceptor)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('cycles')
  @ApiOperation({ summary: 'Create a new performance cycle' })
  createCycle(@Body() createCycleDto: CreateCycleDto) {
    return this.adminService.createCycle(createCycleDto);
  }

  @Get('cycles')
  @ApiOperation({ summary: 'Get all cycles' })
  getCycles() {
    return this.adminService.getCycles();
  }

  @Patch('goals/:id/unlock')
  @ApiOperation({ summary: 'Unlock a locked goal' })
  unlockGoal(@Param('id') id: string) {
    return this.adminService.unlockGoal(id);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get recent audit logs' })
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
