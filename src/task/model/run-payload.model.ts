import { RunStatus } from "@prisma/client";
import { Expose } from "class-transformer";

export class RunPayload {
    @Expose()
    startTime: Date;

    @Expose()
    endTime: Date;

    @Expose()
    status: RunStatus;
}