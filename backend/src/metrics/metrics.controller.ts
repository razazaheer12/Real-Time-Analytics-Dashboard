import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { FilterMetricsDto } from './dto/filter-metrics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get()
  findAll(@Query() filters: FilterMetricsDto, @Request() req) {
    return this.metricsService.findAll(filters, req.user.role);
  }

  @Get('summary')
  getSummary(@Query() filters: FilterMetricsDto, @Request() req) {
    return this.metricsService.getSummary(filters, req.user.role);
  }

  @Get('categories')
  getCategories() {
    return this.metricsService.getCategories();
  }

  @Get('regions')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getRegions() {
    return this.metricsService.getRegions();
  }
}