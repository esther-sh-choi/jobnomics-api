/*
  Warnings:

  - The primary key for the `UsersOnChecklists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `jobId` on table `UsersOnChecklists` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UsersOnChecklists" DROP CONSTRAINT "UsersOnChecklists_jobId_fkey";

-- AlterTable
ALTER TABLE "UsersOnChecklists" DROP CONSTRAINT "UsersOnChecklists_pkey",
ALTER COLUMN "jobId" SET NOT NULL,
ADD CONSTRAINT "UsersOnChecklists_pkey" PRIMARY KEY ("userId", "checklistId", "jobId");

-- AddForeignKey
ALTER TABLE "UsersOnChecklists" ADD CONSTRAINT "UsersOnChecklists_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
