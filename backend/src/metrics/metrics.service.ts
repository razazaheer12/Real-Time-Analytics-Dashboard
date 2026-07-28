import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterMetricsDto } from './dto/filter-metrics.dto';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FilterMetricsDto, userRole: Role) {
  const where: Prisma.MetricWhereInput = {};

  const dateFilter: Prisma.DateTimeFilter<'Metric'> = {};

  // Apna khud ka tracked Date variable — Prisma ke union type pe depend nahi karna
  let gteDate: Date | undefined;
  let lteDate: Date | undefined;

  if (filters.startDate) {
    gteDate = new Date(filters.startDate);
  }
  if (filters.endDate) {
    lteDate = new Date(filters.endDate);
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.regionId) {
    where.regionId = filters.regionId;
  }

  // RBAC: VIEWER sirf last 7 din ka data dekh sakta hai
  if (userRole === Role.VIEWER) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (gteDate) {
      gteDate = new Date(Math.max(gteDate.getTime(), sevenDaysAgo.getTime()));
    } else {
      gteDate = sevenDaysAgo;
    }
  }

  if (gteDate) {
    dateFilter.gte = gteDate;
  }
  if (lteDate) {
    dateFilter.lte = lteDate;
  }

  if (Object.keys(dateFilter).length > 0) {
    where.createdAt = dateFilter;
  }

  const metrics = await this.prisma.metric.findMany({
    where,
    include: {
      category: { select: { name: true } },
      region: { select: { name: true, code: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return metrics;
}

  async getSummary(filters: FilterMetricsDto, userRole: Role) {
  const where: Prisma.MetricWhereInput = {};

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters.regionId) {
    where.regionId = filters.regionId;
  }

  // Plain Date variables track karo — Prisma ke union type se independent
  let gteDate: Date | undefined;
  let lteDate: Date | undefined;

  if (filters.startDate) {
    gteDate = new Date(filters.startDate);
  }
  if (filters.endDate) {
    lteDate = new Date(filters.endDate);
  }

  if (userRole === Role.VIEWER) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (gteDate) {
      gteDate = new Date(Math.max(gteDate.getTime(), sevenDaysAgo.getTime()));
    } else {
      gteDate = sevenDaysAgo;
    }
  }

  const dateFilter: Prisma.DateTimeFilter<'Metric'> = {};
  if (gteDate) {
    dateFilter.gte = gteDate;
  }
  if (lteDate) {
    dateFilter.lte = lteDate;
  }

  if (Object.keys(dateFilter).length > 0) {
    where.createdAt = dateFilter;
  }

  const [totalRevenue, byCategory, byRegion] = await Promise.all([
    this.prisma.metric.aggregate({ where, _sum: { value: true } }),
    this.prisma.metric.groupBy({
      by: ['categoryId'],
      where,
      _sum: { value: true },
    }),
    this.prisma.metric.groupBy({
      by: ['regionId'],
      where,
      _sum: { value: true },
    }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.value || 0,
    byCategory,
    byRegion,
  };
}

  async getCategories() {
    return this.prisma.category.findMany();
  }

  async getRegions() {
    return this.prisma.region.findMany();
  }
}
