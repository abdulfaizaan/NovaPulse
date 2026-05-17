import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CheckInStatus } from '../../../common/enums';

export class CreateCheckinDto {
  @ApiProperty()
  @IsString()
  goalId: string;

  @ApiProperty()
  @IsString()
  cycleId: string;

  @ApiProperty()
  @IsNumber()
  plannedTarget: number;

  @ApiProperty()
  @IsNumber()
  actualAchievement: number;

  @ApiProperty({ enum: CheckInStatus })
  @IsEnum(CheckInStatus)
  status: CheckInStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReviewCheckinDto {
  @ApiProperty({ enum: CheckInStatus })
  @IsEnum(CheckInStatus)
  status: CheckInStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
