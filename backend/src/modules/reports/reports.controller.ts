import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../common/enums';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MANAGER, Role.ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('completion-rates')
  @ApiOperation({ summary: 'Get global completion rates' })
  getCompletionRates() {
    return this.reportsService.getCompletionRates();
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get analytics by department' })
  getDepartmentAnalytics() {
    return this.reportsService.getDepartmentAnalytics();
  }
}
