import { Module } from '@nestjs/common';
import { LifeService } from './life.service';
import { LifeUpdate } from './life.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LifeUpdate],
  providers: [LifeService, LifeUpdate],
})
export class LifeModule {}
