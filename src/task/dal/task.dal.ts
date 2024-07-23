import { Injectable } from '@nestjs/common';
import { Task, Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/service/prisma.service';

@Injectable()
export class TaskDal {
  constructor(private prisma: PrismaService) {}

  async getTask(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
  ): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });
  }

  async getTasks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }): Promise<Task[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.task.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
  }

  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    const { where, data } = params;
    return this.prisma.task.update({
      data,
      where,
    });
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({
      where,
    });
  }
}