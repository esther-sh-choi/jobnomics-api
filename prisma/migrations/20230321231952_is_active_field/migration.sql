-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "platform" DROP NOT NULL,
ALTER COLUMN "platform" SET DEFAULT 'unknown';

-- AlterTable
ALTER TABLE "UsersOnJobs" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
