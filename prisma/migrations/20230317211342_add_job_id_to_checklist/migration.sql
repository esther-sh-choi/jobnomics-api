/*
  Warnings:

  - The primary key for the `UsersOnChecklists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `jobId` to the `UsersOnChecklists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersOnChecklists" DROP CONSTRAINT "UsersOnChecklists_pkey",
ADD COLUMN     "jobId" INTEGER NOT NULL,
ADD CONSTRAINT "UsersOnChecklists_pkey" PRIMARY KEY ("userId", "checklistId", "jobId");

-- AddForeignKey
ALTER TABLE "UsersOnChecklists" ADD CONSTRAINT "UsersOnChecklists_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
