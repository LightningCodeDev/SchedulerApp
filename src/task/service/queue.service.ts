import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QueueType } from '../enum/queue-type.enum';
import { Job, JobsOptions, Queue } from 'bullmq';
import { ActionType, RecurrencePattern, Task } from '@prisma/client';
import { DateTime } from 'luxon';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueType.CONSOLE_LOG) private consoleQueue: Queue,
    @InjectQueue(QueueType.COMPUTATIONAL) private computationalQueue: Queue,
  ) {}

  async addJobToQueue(task: Task): Promise<Job<Task, any, string>> {
    const queue = this.getQueueForActionType(task.actionType);
    const jobName = this.getJobName(task.actionType, task.id);
    const jobOptions = this.getJobOptions(task.scheduledTime, task.recurrence);
    return await queue.add(jobName, task, jobOptions);
  }

  async removeJob(task: Task): Promise<void> {
    const queue = this.getQueueForActionType(task.actionType);
    const jobName = this.getJobName(task.actionType, task.id);
    
    if (task.recurrence === RecurrencePattern.NONE) {
      const job = await queue.getJob(task.jobId);
      if (!job) {
        throw new NotFoundException('Job not found');
      }
      await job.remove();
    } else {
      const jobOptions = this.getJobOptions(task.scheduledTime, task.recurrence);
      await queue.removeRepeatable(jobName, jobOptions.repeat);
    }
  }

  private getJobName(actionType: ActionType, taskId: string): string {
    return `${actionType}-${taskId}`;
  }

  async pauseQueue(queueType: QueueType): Promise<void> {
    const queue = this.getQueueByQueueType(queueType);
    await queue.pause();
  }

  async resumeQueue(queueType: QueueType): Promise<void> {
    const queue = this.getQueueByQueueType(queueType);
    await queue.resume();
  }

  private getQueueByQueueType(queueType: QueueType): Queue {
    switch (queueType) {
      case QueueType.CONSOLE_LOG:
        return this.consoleQueue;
      case QueueType.COMPUTATIONAL:
        return this.computationalQueue;
    }
  }

  private getQueueForActionType(actionType: ActionType): Queue {
    switch (actionType) {
      case ActionType.CONSOLE_GREETING:
      case ActionType.CONSOLE_GOODBYE:
        return this.consoleQueue;
      case ActionType.MATH_AVERAGE:
        return this.computationalQueue;
      default:
        throw new Error(`Unsupported action type: ${actionType}`);
    }
  }

  private getJobOptions(scheduledTime: Date, recurrence: RecurrencePattern): JobsOptions {
    const delay = scheduledTime.getTime() - Date.now()
    const datetime = DateTime.fromJSDate(scheduledTime);
    const minute = datetime.minute;
    const hour = datetime.hour;
    const dayOfMonth = datetime.day;
    const dayOfWeek = datetime.weekday;
    
    switch (recurrence) {
      case RecurrencePattern.NONE:
        return { delay }
      case RecurrencePattern.EVERY_MINUTE:
      // needs to be pattern, startDate for some reason doesnt work with every
        return { repeat: { pattern: `* * * * *`, startDate: scheduledTime }}
      case RecurrencePattern.EVERY_HOUR:
        return { repeat: { pattern: `${minute} * * * *` }}
      case RecurrencePattern.DAILY:
        return { repeat: { pattern: `${minute} ${hour} * * *` }}; 
      case RecurrencePattern.WEEKLY:
        return { repeat: { pattern: `${minute} ${hour} * * ${dayOfWeek}` }}; 
      case RecurrencePattern.MONTHLY:
        // problematic because months have different number of days, needs to be decided how it should work
        const dayOfMonthValue = dayOfMonth >= 28 ? "L" : dayOfMonth.toString();
        return { repeat: { pattern: `${minute} ${hour} ${dayOfMonthValue} * *` }}; 
      default:
        return null;
    }
  }
}
