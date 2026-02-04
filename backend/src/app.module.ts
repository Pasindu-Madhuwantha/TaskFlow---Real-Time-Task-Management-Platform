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
      // For Cloud SQL Unix socket, DATABASE_HOST will be like /cloudsql/project:region:instance
      // The pg driver automatically treats hosts starting with / as a unix socket directory
      ...(process.env.DATABASE_HOST?.startsWith('/cloudsql/')
        ? { host: process.env.DATABASE_HOST }
        : {
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432'),
        }),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'taskflow',
      entities: [User, Task],
      synchronize: process.env.NODE_ENV !== 'production', // Only in development
      retryAttempts: 3,
      retryDelay: 3000,
      autoLoadEntities: true,
    }),
    // Only enable Redis cache if REDIS_HOST is configured
    ...(process.env.REDIS_HOST
      ? [CacheModule.register({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
        ttl: 600,
        isGlobal: true,
      })]
      : [CacheModule.register({ isGlobal: true })]), // Use in-memory cache as fallback
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
