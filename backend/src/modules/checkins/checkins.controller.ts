import { Controller, Post, Body, Get, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { CreateCheckinDto, ReviewCheckinDto } from './dto/checkin.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { AuditLogInterceptor } from '../../interceptors/audit-log.interceptor';
import { Role } from '../../common/enums';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Check-ins')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditLogInterceptor)
@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  @Roles(Role.EMPLOYEE)
  @ApiOperation({ summary: 'Submit a quarterly check-in' })
  create(@CurrentUser() user: any, @Body() createCheckinDto: CreateCheckinDto) {
    return this.checkinsService.create(user.id, createCheckinDto);
  }

  @Get('goal/:goalId')
  @ApiOperation({ summary: 'Get all check-ins for a specific goal' })
  findByGoal(@Param('goalId') goalId: string, @CurrentUser() user: any) {
    return this.checkinsService.findByGoal(goalId, user.id, user.role);
  }

  @Patch(':checkinId/review')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Review a subordinates check-in (Approve/Reject with feedback)' })
  review(
    @Param('checkinId') checkinId: string,
    @CurrentUser() user: any,
    @Body() reviewCheckinDto: ReviewCheckinDto,
  ) {
    return this.checkinsService.review(checkinId, user.id, reviewCheckinDto);
  }
}
