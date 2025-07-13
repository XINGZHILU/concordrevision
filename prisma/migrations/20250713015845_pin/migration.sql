-- AlterTable
ALTER TABLE "Olympiad_Resource" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UCASPost" ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false;
