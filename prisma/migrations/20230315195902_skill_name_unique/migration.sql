/*
  Warnings:

  - You are about to drop the column `isComplete` on the `UsersOnChecklists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UsersOnChecklists" DROP COLUMN "isComplete";

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");
