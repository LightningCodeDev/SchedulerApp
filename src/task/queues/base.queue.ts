import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TaskDal } from '../dal/task.dal';
import { RunDal } from '../dal/run.dal';
import { Injectable } from '@nestjs/common';
import { RecurrencePattern, RunStatus, Task, TaskStatus } from '@prisma/client';

@Injectable()
export abstract class BaseQueue extends WorkerHost {
  constructor(
    private taskDal: TaskDal,
    private runDal: RunDal,
  ) {
    super();
  }

  async process(job: Job<Task, any, string>): Promise<any> {
    const task = job.data;
    const startTime = new Date();
    
    const run = await this.runDal.createRun({
        startTime,
        task: { connect: { id: task.id } },
        status: RunStatus.IN_PROGRESS
    })

    let status: RunStatus = RunStatus.COMPLETED
    try {
      await this.processJob(job);
    } catch (error) {
        status = RunStatus.FAILED;
    }
    finally {
        const endTime = new Date();
        // update run
        await this.runDal.updateRun({ where: { id: run.id}, data: { ...run, endTime, status }});
        await this.taskDal.updateTask({ where: { id: task.id}, data: {
            ...task,
            status: task.recurrence === RecurrencePattern.NONE ? TaskStatus.COMPLETED : TaskStatus.RECURRING
        }})
    }
  }

  protected abstract processJob(job: Job<Task, any, string>): Promise<any>;
}
