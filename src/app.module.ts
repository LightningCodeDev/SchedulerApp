import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TaskModule,
    BullModule.forRoot({
      connection: {
          host: process.env['REDIS_HOST'],
          port: parseInt(process.env['REDIS_PORT']),
          password: process.env['REDIS_PASSWORD'],
      }
  })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
