import { Injectable } from "@nestjs/common";
import { TaskPayload } from "../model/task-payload.model";
import { plainToClass } from "class-transformer";
import { Task } from "@prisma/client";

@Injectable()
export class TaskMapperService {
    constructor() {}

    mapTaskToTaskPayload(task: Task): TaskPayload {
        return plainToClass(TaskPayload, task, { excludeExtraneousValues: true});
    }
}