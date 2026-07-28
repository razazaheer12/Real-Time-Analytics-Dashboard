import { IsOptional, IsDateString, IsString, IsUUID } from 'class-validator';

export class FilterMetricsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  regionId?: string;
}