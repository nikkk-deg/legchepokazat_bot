import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { LifeModule } from './life/life.module';
import * as LocalSession from 'telegraf-session-local';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from './prisma/prisma.module';
import { NextFunction } from 'express';

const session = new LocalSession({ database: 'session_db.json' });

setInterval(() => {
  fetch('https://api.telegram.org/bot7202681628')
    .then((json) => console.log('все норм'))
    .catch(() => {
      throw new HttpException(
        'не удалось подключиться к api телеграм',
        HttpStatus.BAD_REQUEST,
      );
    });
}, 180000);

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
