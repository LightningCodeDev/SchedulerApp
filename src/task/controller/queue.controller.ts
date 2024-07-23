import { Body, Controller, Post } from "@nestjs/common";
import { QueueService } from "../service/queue.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { QueueDto } from "../model/queue-dto.model";

@ApiTags('Queues')
@Controller('queue')
export class QueueController {
    constructor(
        private queueService: QueueService
    ) {}

    @Post('pause')
    @ApiOperation({ summary: 'Pauses execution of all tasks in queue'})
    async pauseQueue(
        @Body() queueDto: QueueDto
    ) {
        return this.queueService.pauseQueue(queueDto.queueType);
    }

    @Post('resume')
    @ApiOperation({ summary: 'Resumes execution of all tasks in queue'})
    async resumeQueue(
        @Body() queueDto: QueueDto
    ) {
        return this.queueService.resumeQueue(queueDto.queueType);
    }
}