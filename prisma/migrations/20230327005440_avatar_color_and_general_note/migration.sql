/*
  Warnings:

  - Added the required column `avatarColor` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "avatarColor" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UsersOnJobs" ADD COLUMN     "generalNote" TEXT;
