/*
  Warnings:

  - You are about to drop the column `interview_examples` on the `Job` table. All the data in the column will be lost.
  - Added the required column `platform` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "interview_examples",
ADD COLUMN     "interviewExamples" TEXT,
ADD COLUMN     "platform" TEXT NOT NULL,
ADD COLUMN     "platformJobId" TEXT;
