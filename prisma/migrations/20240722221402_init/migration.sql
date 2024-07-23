-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CONSOLE_GREETING', 'CONSOLE_GOODBYE', 'MATH_AVERAGE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'RECURRING', 'COMPLETED', 'PAUSED');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RecurrencePattern" AS ENUM ('NONE', 'EVERY_MINUTE', 'EVERY_HOUR', 'DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledTime" TIMESTAMP(3) NOT NULL,
    "recurrence" "RecurrencePattern" NOT NULL DEFAULT 'NONE',
    "actionType" "ActionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jobId" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "status" "RunStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "result" TEXT,
    "taskId" TEXT NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
