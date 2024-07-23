import { ActionType, RecurrencePattern, TaskStatus } from "@prisma/client";
import { Expose } from "class-transformer";

export class TaskPayload {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    status: TaskStatus;

    @Expose()
    scheduledTime: Date;

    @Expose()
    recurrence: RecurrencePattern;

    @Expose()
    actionType: ActionType;
}