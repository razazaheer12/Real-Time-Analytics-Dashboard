import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { FilterMetricsDto } from '../metrics/dto/filter-metrics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('csv')
  async exportCsv(@Query() filters: FilterMetricsDto, @Res() res: Response) {
    const csv = await this.exportService.generateCsv(filters);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="analytics-report.csv"');
    res.send(csv);
  }

  @Get('pdf')
  async exportPdf(@Query() filters: FilterMetricsDto, @Res() res: Response) {
    const pdfBuffer = await this.exportService.generatePdf(filters);

    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', 'attachment; filename="analytics-report.pdf"');
    res.send(pdfBuffer);
  }
}