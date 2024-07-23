import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task-dto.model';

export class UpdateTaskDto extends PartialType(OmitType(CreateTaskDto, ['actionType'] as const)) {}