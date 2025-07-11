-- AlterTable
ALTER TABLE "UserSubjectSubscription" ADD COLUMN     "resource_notification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "test_notification" BOOLEAN NOT NULL DEFAULT true;
