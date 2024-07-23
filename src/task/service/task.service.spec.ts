import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskDal } from '../dal/task.dal';
import { QueueService } from './queue.service';
import { RunDal } from '../dal/run.dal';
import { CreateTaskDto } from '../model/create-task-dto.model';
import { RecurrencePattern, TaskStatus } from '@prisma/client';
import { ActionType } from '../enum/action-type.enum';

describe('TaskService', () => {
  let service: TaskService;
  let taskDal: TaskDal;
  let queueService: QueueService;

  const mockTaskDal = {
    createTask: jest.fn(),
    updateTask: jest.fn(),
    getTask: jest.fn(),
  };

  const mockQueueService = {
    addJobToQueue: jest.fn(),
    removeJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskDal, useValue: mockTaskDal },
        { provide: QueueService, useValue: mockQueueService },
        { provide: RunDal, useValue: {} },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskDal = module.get<TaskDal>(TaskDal);
    queueService = module.get<QueueService>(QueueService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a non-recurring task', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      scheduledTime: new Date(),
      actionType: ActionType.CONSOLE_GREETING,
      recurrence: RecurrencePattern.NONE,
    };

    const createdTask = {
      ...createTaskDto,
      id: 'test-id',
      status: TaskStatus.PENDING,
    };

    const job = { id: 'job-id' };

    mockTaskDal.createTask.mockResolvedValue(createdTask);
    mockQueueService.addJobToQueue.mockResolvedValue(job);
    mockTaskDal.updateTask.mockResolvedValue(createdTask);

    // Act
    const result = await service.createTask(createTaskDto);

    // Assert
    expect(taskDal.createTask).toHaveBeenCalledWith({
      ...createTaskDto,
      status: TaskStatus.PENDING,
    });
    expect(queueService.addJobToQueue).toHaveBeenCalledWith(createdTask);
    expect(taskDal.updateTask).toHaveBeenCalledWith({
      where: { id: createdTask.id },
      data: { jobId: job.id },
    });
    expect(result).toEqual(createdTask);
  });

  it('should create a recurring task', async () => {
    // Arrange
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      scheduledTime: new Date(),
      actionType: ActionType.CONSOLE_GREETING,
      recurrence: RecurrencePattern.DAILY,
    };

    const createdTask = {
      ...createTaskDto,
      id: 'test-id',
      status: TaskStatus.RECURRING,
    };

    mockTaskDal.createTask.mockResolvedValue(createdTask);
    mockQueueService.addJobToQueue.mockResolvedValue({});

    // Act
    const result = await service.createTask(createTaskDto);

    // Assert
    expect(taskDal.createTask).toHaveBeenCalledWith({
      ...createTaskDto,
      status: TaskStatus.RECURRING,
    });
    expect(queueService.addJobToQueue).toHaveBeenCalledWith(createdTask);
    expect(taskDal.updateTask).not.toHaveBeenCalled();
    expect(result).toEqual(createdTask);
  });
});
