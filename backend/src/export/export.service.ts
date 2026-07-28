import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';
import { FilterMetricsDto } from '../metrics/dto/filter-metrics.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  private async getFilteredMetrics(filters: FilterMetricsDto) {
    const where: Prisma.MetricWhereInput = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.regionId) {
      where.regionId = filters.regionId;
    }

    const dateFilter: Prisma.DateTimeFilter<'Metric'> = {};
    if (filters.startDate) {
      dateFilter.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      dateFilter.lte = new Date(filters.endDate);
    }
    if (Object.keys(dateFilter).length > 0) {
      where.createdAt = dateFilter;
    }

    return this.prisma.metric.findMany({
      where,
      include: {
        category: { select: { name: true } },
        region: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateCsv(filters: FilterMetricsDto): Promise<string> {
    const metrics = await this.getFilteredMetrics(filters);

    const rows = metrics.map((m) => ({
      Title: m.title,
      Value: m.value,
      Unit: m.unit,
      Category: m.category.name,
      Region: m.region.name,
      RegionCode: m.region.code,
      Date: m.createdAt.toISOString(),
    }));

    const parser = new Parser({
      fields: ['Title', 'Value', 'Unit', 'Category', 'Region', 'RegionCode', 'Date'],
    });

    return parser.parse(rows);
  }

  async generatePdf(filters: FilterMetricsDto): Promise<Buffer> {
    const metrics = await this.getFilteredMetrics(filters);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(18).text('Analytics Report', { align: 'center' });
      doc.moveDown(0.3);
      doc.fontSize(10).fillColor('gray').text(
        `Generated on ${new Date().toLocaleString()}`,
        { align: 'center' },
      );
      doc.moveDown(1.5);

      // Summary line
      const totalRevenue = metrics.reduce((sum, m) => sum + m.value, 0);
      doc.fontSize(11).fillColor('black').text(
        `Total Records: ${metrics.length}   |   Total Revenue: $${totalRevenue.toLocaleString()}`,
      );
      doc.moveDown(1);

      // Table header
      const tableTop = doc.y;
      const colWidths = [140, 70, 90, 90, 90];
      const headers = ['Title', 'Value', 'Category', 'Region', 'Date'];

      let x = doc.page.margins.left;
      doc.fontSize(9).fillColor('white');
      doc.rect(x, tableTop, colWidths.reduce((a, b) => a + b, 0), 20).fill('#2563eb');
      doc.fillColor('white');
      headers.forEach((header, i) => {
        doc.text(header, x + 5, tableTop + 6, { width: colWidths[i] - 10 });
        x += colWidths[i];
      });

      // Table rows
      let y = tableTop + 20;
      doc.fillColor('black').fontSize(8);

      metrics.slice(0, 500).forEach((m, rowIndex) => {
        if (y > doc.page.height - 60) {
          doc.addPage();
          y = doc.page.margins.top;
        }

        if (rowIndex % 2 === 0) {
          doc.rect(doc.page.margins.left, y, colWidths.reduce((a, b) => a + b, 0), 18).fill('#f3f4f6');
          doc.fillColor('black');
        }

        x = doc.page.margins.left;
        const rowData = [
          m.title,
          `$${m.value.toLocaleString()}`,
          m.category.name,
          m.region.name,
          new Date(m.createdAt).toLocaleDateString(),
        ];

        rowData.forEach((cell, i) => {
          doc.text(String(cell), x + 5, y + 4, { width: colWidths[i] - 10 });
          x += colWidths[i];
        });

        y += 18;
      });

      if (metrics.length > 500) {
        doc.moveDown(1);
        doc.fontSize(9).fillColor('gray').text(
          `Note: Showing first 500 of ${metrics.length} records. Use CSV export for full data.`,
        );
      }

      doc.end();
    });
  }
}