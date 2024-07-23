import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueType } from '../enum/queue-type.enum';
import { Task } from '@prisma/client';
import { BaseQueue } from './base.queue';

@Processor(QueueType.COMPUTATIONAL)
export class ComputationalQueue extends BaseQueue {
  async processJob(job: Job<Task, any, string>): Promise<any> {
    console.log('COMPUTING....');
  }
}