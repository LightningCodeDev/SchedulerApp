import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { TaskDal } from "../dal/task.dal";
import { RecurrencePattern, Run, Task, TaskStatus } from "@prisma/client";
import { CreateTaskDto } from "../model/create-task-dto.model";
import { QueueService } from "./queue.service";
import { UpdateTaskDto } from "../model/update-task-dto.model";
import { RunDal } from "../dal/run.dal";

@Injectable()
export class TaskService {
    constructor(
        private taskDal: TaskDal,
        private runDal: RunDal,
        private queueService: QueueService,
    ) {}

    async getTasks(): Promise<Task[]> {
        return this.taskDal.getTasks({});
    }

    async getTaskById(id: string): Promise<Task> {
        const task = await this.taskDal.getTask({ id });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return task;
    }

    async getTaskRunHistory(taskId: string): Promise<Run[]> {
        return this.runDal.getRuns({where: {taskId}});
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const isRecurring = createTaskDto.recurrence !== RecurrencePattern.NONE;
        const task = await this.taskDal.createTask({
            ...createTaskDto,
            status: isRecurring ? TaskStatus.RECURRING : TaskStatus.PENDING
        });
        const job = await this.queueService.addJobToQueue(task);

        if (!isRecurring) {
            // if we dont have recurring job store job ID
            await this.taskDal.updateTask({ where: {id: task.id}, data: {jobId: job.id }});
        }
        return task;
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.getTaskById(id);
        
        if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.PAUSED) {
            throw new ConflictException('Cannot update completed or paused task');
        }

        // special case if we are updating recurrent type to non-recurrent 
        // but we didn't update scheduled time to be in the future
        if (task.recurrence !== RecurrencePattern.NONE && 
            updateTaskDto.recurrence === RecurrencePattern.NONE &&
            !updateTaskDto.scheduledTime &&
            task.scheduledTime < new Date()
        ) {
            throw new ConflictException('Cannot convert recurrent type to non-recurrent with scheduledTime in past');
        }

        const status = updateTaskDto.recurrence 
            ? updateTaskDto.recurrence === RecurrencePattern.NONE ? TaskStatus.PENDING : TaskStatus.RECURRING
            : task.status;
                        
        // delete from queues old tasks
        await this.queueService.removeJob(task);
        const updatedTask = await this.taskDal.updateTask({ where: { id }, data: { 
            ...updateTaskDto,
            status
        }});
        // inserts into queue new updated tasks
        const job = await this.queueService.addJobToQueue(updatedTask);

        if (updatedTask.recurrence === RecurrencePattern.NONE) {
            // if we dont have recurring job store job ID
            await this.taskDal.updateTask({ where: {id: task.id}, data: {jobId: job.id }});
        }
        return updatedTask;
    }

    async pauseTask(id: string): Promise<Task> {
        let task = await this.getTaskById(id);
        const canPause = task.status === TaskStatus.PENDING || task.status === TaskStatus.RECURRING; 
        if (canPause) {
            task = await this.taskDal.updateTask({ where: {id}, data: {status: TaskStatus.PAUSED }});
            await this.queueService.removeJob(task);    
        }
        return task;
    }

    async resumeTask(id: string): Promise<Task> {
        let task = await this.getTaskById(id);
        const canResume = task.status === TaskStatus.PAUSED
        const isRecurring = task.recurrence !== RecurrencePattern.NONE;
        if (canResume) {
            task = await this.taskDal.updateTask({ where: {id}, data: {
                status: isRecurring ? TaskStatus.RECURRING : TaskStatus.PENDING
            }})
            await this.queueService.addJobToQueue(task);
        }
        return task;
    }

    async deleteTask(id: string): Promise<Task> {
        const task = await this.getTaskById(id);
        await this.queueService.removeJob(task);
        return this.taskDal.deleteTask({ id });
    }
}