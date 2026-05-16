import { Controller, Get, Post, Body, Patch, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/goals.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuditLogInterceptor } from '../../interceptors/audit-log.interceptor';
import { Role } from '../../common/enums';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditLogInterceptor)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: 'Create a new goal' })
  create(@CurrentUser() user: any, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(user.id, createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all visible goals based on role' })
  findAll(@CurrentUser() user: any) {
    return this.goalsService.findAll(user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific goal by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.goalsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a goal' })
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @CurrentUser() user: any) {
    return this.goalsService.update(id, updateGoalDto, user.id, user.role);
  }

  @Patch(':id/submit')
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: 'Submit goal for review' })
  submit(@Param('id') id: string, @CurrentUser() user: any) {
    return this.goalsService.submit(id, user.id);
  }

  @Patch(':id/approve')
  @Roles(Role.MANAGER, Role.ADMIN)
  @ApiOperation({ summary: 'Approve a submitted goal' })
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.goalsService.approve(id, user.id);
  }
}
