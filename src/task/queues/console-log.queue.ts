import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueType } from '../enum/queue-type.enum';
import { ActionType } from '../enum/action-type.enum';
import { Task } from '@prisma/client';
import { BaseQueue } from './base.queue';

@Processor(QueueType.CONSOLE_LOG)
export class ConsoleLogQueue extends BaseQueue {
  async processJob(job: Job<Task, any, string>): Promise<any> {
    switch(job.data.actionType) {
      case ActionType.CONSOLE_GREETING:
        console.log('Hello!');
        break;
      case ActionType.CONSOLE_GOODBYE:
        console.log('Bye!');
        break;
    }
  }
}