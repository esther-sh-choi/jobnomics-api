/*
  Warnings:

  - A unique constraint covering the columns `[platformJobId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Job_platformJobId_key" ON "Job"("platformJobId");
