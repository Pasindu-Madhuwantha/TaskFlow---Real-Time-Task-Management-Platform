import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Task } from './tasks/entities/task.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'taskflow',
      entities: [User, Task],
      synchronize: true, // Only for development
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 600,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
    TasksModule,
    UsersModule,
    AnalyticsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
