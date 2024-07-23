import { IsEnum } from "class-validator";
import { QueueType } from "../enum/queue-type.enum";
import { ApiProperty } from "@nestjs/swagger";

export class QueueDto {
    @ApiProperty({
        description: 'Queue type',
        enum: QueueType,
    })
    @IsEnum(QueueType)
    queueType: QueueType;    
}