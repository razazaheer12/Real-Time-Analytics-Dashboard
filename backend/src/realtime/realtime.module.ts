import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RealtimeGateway } from './realtime.gateway';
import { DataSimulatorService } from './data-simulator.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET as string,
        signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as any },
      }),
    }),
  ],
  providers: [RealtimeGateway, DataSimulatorService],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}