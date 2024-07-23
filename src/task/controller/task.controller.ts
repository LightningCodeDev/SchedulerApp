import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Run, Task } from "@prisma/client";
import { TaskService } from "../service/task.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateTaskDto } from "../model/create-task-dto.model";
import { UpdateTaskDto } from "../model/update-task-dto.model";
import { TransformResponse } from "src/core/interceptor/transform-response.interceptor";
import { TaskPayload } from "../model/task-payload.model";
import { RunPayload } from "../model/run-payload.model";

@ApiTags('Tasks')
@Controller('task')
export class TaskController {
    constructor(
        private taskService: TaskService,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get all tasks' })
    @TransformResponse(TaskPayload)
    async getTasks(): Promise<Task[]> {
        return this.taskService.getTasks();
    }
  
    @Get(':taskId')
    @ApiOperation({ summary: 'Get task by id' })
    @TransformResponse(TaskPayload)
    async getTaskById(
        @Param('taskId') taskId: string
    ): Promise<Task> {
        return this.taskService.getTaskById(taskId);
    }
  
    @Get('history/:taskId')
    @ApiOperation({ summary: 'Get task run history' })
    @TransformResponse(RunPayload)
    async getTaskRunHistory(
        @Param('taskId') taskId: string
    ): Promise<Run[]> {
        return this.taskService.getTaskRunHistory(taskId);
    }

    @Post()
    @ApiOperation({ summary: 'Create task' })
    @TransformResponse(TaskPayload)
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }
  
    @Patch(':taskId')
    @ApiOperation({ summary: 'Update task' })
    @TransformResponse(TaskPayload)
    async updateTask(
        @Param('taskId') taskId: string,
        @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<Task> {
        return this.taskService.updateTask(taskId, updateTaskDto);
    }
  
    @Post('pause/:taskId')
    @ApiOperation({ summary: 'Pause execution of task'})
    @TransformResponse(TaskPayload)
    async pauseTask(
        @Param('taskId') taskId: string
    ): Promise<Task> {
        return this.taskService.pauseTask(taskId);
    }

    @Post('resume/:taskId')
    @ApiOperation({ summary: 'Resume execution of task'})
    @TransformResponse(TaskPayload)
    async resumeTask(
        @Param('taskId') taskId: string
    ): Promise<Task> {
        return this.taskService.resumeTask(taskId);
    }

    @Delete(':taskId')
    @ApiOperation({ summary: 'Delete task and its run history'})
    @TransformResponse(TaskPayload)
    async deleteTask(
        @Param('taskId') taskId: string
    ): Promise<Task> {
        return this.taskService.deleteTask(taskId);
    }
}