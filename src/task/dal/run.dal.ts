import { Injectable } from '@nestjs/common';
import { Run, Prisma } from '@prisma/client';
import { PrismaService } from '../../core/prisma/service/prisma.service';

@Injectable()
export class RunDal {
  constructor(private prisma: PrismaService) {}

  async getRun(
    runWhereUniqueInput: Prisma.RunWhereUniqueInput,
  ): Promise<Run | null> {
    return this.prisma.run.findUnique({
      where: runWhereUniqueInput,
    });
  }

  async getRuns(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RunWhereUniqueInput;
    where?: Prisma.RunWhereInput;
    orderBy?: Prisma.RunOrderByWithRelationInput;
  }): Promise<Run[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.run.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createRun(data: Prisma.RunCreateInput): Promise<Run> {
    return this.prisma.run.create({
      data,
    });
  }

  async updateRun(params: {
    where: Prisma.RunWhereUniqueInput;
    data: Prisma.RunUpdateInput;
  }): Promise<Run> {
    const { data, where } = params;
    return this.prisma.run.update({
      data,
      where,
    });
  }
}