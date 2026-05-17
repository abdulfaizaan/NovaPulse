import { IsString, IsNumber, IsEnum, Min, Max, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GoalStatus } from '../../../common/enums';

export class CreateGoalDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  thrustArea: string;

  @ApiProperty()
  @IsString()
  unitOfMeasure: string;

  @ApiProperty()
  @IsNumber()
  targetValue: number;

  @ApiProperty()
  @IsNumber()
  @Min(10)
  @Max(100)
  weightage: number;

  @ApiProperty()
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isShared?: boolean;
}

export class UpdateGoalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  targetValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  weightage?: number;

  @ApiPropertyOptional({ enum: GoalStatus })
  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;
}

export class CreateSharedGoalDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  thrustArea: string;

  @ApiProperty()
  @IsString()
  unitOfMeasure: string;

  @ApiProperty()
  @IsNumber()
  targetValue: number;

  @ApiProperty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({ type: 'array', items: { type: 'object', properties: { employeeId: { type: 'string' }, weightage: { type: 'number' } } } })
  assignments: { employeeId: string; weightage: number }[];
}
