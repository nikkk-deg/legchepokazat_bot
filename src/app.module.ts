import { Module } from '@nestjs/common';
import { LifeModule } from './life/life.module';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from './prisma/prisma.module';

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    LifeModule,
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: process.env.TOKEN,
    }),
    PrismaModule,
  ],
})
export class AppModule {}
