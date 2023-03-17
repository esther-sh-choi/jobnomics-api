/*
  Warnings:

  - The primary key for the `UsersOnChecklists` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "UsersOnChecklists" DROP CONSTRAINT "UsersOnChecklists_jobId_fkey";

-- AlterTable
ALTER TABLE "UsersOnChecklists" DROP CONSTRAINT "UsersOnChecklists_pkey",
ALTER COLUMN "jobId" DROP NOT NULL,
ADD CONSTRAINT "UsersOnChecklists_pkey" PRIMARY KEY ("userId", "checklistId");

-- AddForeignKey
ALTER TABLE "UsersOnChecklists" ADD CONSTRAINT "UsersOnChecklists_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
