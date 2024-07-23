import { Module } from '@nestjs/common';
import { TaskController } from './controller/task.controller';
import { TaskService } from './service/task.service';
import { TaskDal } from './dal/task.dal';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from './enum/queue-type.enum';
import { QueueService } from './service/queue.service';
import { ConsoleLogQueue } from './queues/console-log.queue';
import { ComputationalQueue } from './queues/computational.queue';
import { RunDal } from './dal/run.dal';
import { QueueController } from './controller/queue.controller';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue(
        {
            name: QueueType.CONSOLE_LOG
        },
        {
            name: QueueType.COMPUTATIONAL
        }
    )
  ],
  controllers: [
    TaskController,
    QueueController,
],
  providers: [
    ComputationalQueue,
    ConsoleLogQueue,
    QueueService,
    TaskService,
    TaskDal,
    RunDal,
  ],
})
export class TaskModule {}
