import { ApiProperty } from "@nestjs/swagger";
import { RecurrencePattern } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString, MaxLength, MinDate, MinLength } from "class-validator";
import { ActionType } from "../enum/action-type.enum";

export class CreateTaskDto {
    @ApiProperty({
        description: 'The title of the task',
        maxLength: 12,
        minLength: 3,
    })
    @IsString()
    @MaxLength(12)
    @MinLength(3)
    title: string;

    @ApiProperty({
        description: 'The description of the task',
        maxLength: 256,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(256)
    description: string;

    @ApiProperty({
        description: 'The scheduled time for the task',
        type: String,
        format: 'date-time',
    })
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @IsDate()
    @MinDate(new Date(), {
        message: 'scheduledTime must not be in the past',
    })
    scheduledTime: Date;

    @ApiProperty({
        description: 'The recurrence pattern for the task',
        enum: RecurrencePattern,
    })
    @IsEnum(RecurrencePattern)
    recurrence: RecurrencePattern;

    @ApiProperty({
        description: 'Action that will be executed',
        enum: ActionType,
      })
    @IsEnum(ActionType)
    actionType: ActionType;
}