import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService
  ],
  exports: [
    PrismaService
  ]
})
export class PrismaModule {}