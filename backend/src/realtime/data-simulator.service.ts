import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from './realtime.gateway';

@Injectable()
export class DataSimulatorService implements OnModuleInit, OnModuleDestroy {
  private intervalRef: NodeJS.Timeout;
  private logger = new Logger('DataSimulatorService');

  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway,
  ) {}

  onModuleInit() {
    // Har 4 second mein ek naya simulated metric generate karo
    this.intervalRef = setInterval(() => {
      this.generateLiveMetric();
    }, 4000);

    this.logger.log('Data simulator started (interval: 4s)');
  }

  onModuleDestroy() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

  private async generateLiveMetric() {
    try {
      // Random existing category aur region uthao
      const categories = await this.prisma.category.findMany();
      const regions = await this.prisma.region.findMany();

      if (categories.length === 0 || regions.length === 0) {
        this.logger.warn('No categories/regions found — run seed script first');
        return;
      }

      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const randomValue = Math.floor(Math.random() * 8000) + 1000;

      const liveMetric = await this.prisma.metric.create({
        data: {
          title: `${randomCategory.name} Revenue`,
          value: randomValue,
          unit: 'USD',
          categoryId: randomCategory.id,
          regionId: randomRegion.id,
        },
        include: {
          category: { select: { name: true } },
          region: { select: { name: true, code: true } },
        },
      });

      // Sab connected clients ko naya data bhejo
      this.realtimeGateway.emitToViewers('metric:new', liveMetric);

      this.logger.debug(`Emitted live metric: ${liveMetric.title} = $${liveMetric.value}`);
    } catch (err) {
      this.logger.error('Failed to generate live metric', err);
    }
  }
}