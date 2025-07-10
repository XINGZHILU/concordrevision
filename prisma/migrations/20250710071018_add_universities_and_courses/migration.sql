/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `University` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_university_id_fkey";

-- DropTable
DROP TABLE "Course";

-- CreateTable
CREATE TABLE "UcasCourse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "duration_years" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "entry_requirements_text" TEXT NOT NULL,
    "alevel_requirements" TEXT,
    "ib_requirements" TEXT,
    "required_subjects" TEXT[],
    "recommended_subjects" TEXT[],
    "url" TEXT,

    CONSTRAINT "UcasCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UcasCourse_universityId_idx" ON "UcasCourse"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "University_name_key" ON "University"("name");

-- AddForeignKey
ALTER TABLE "UcasCourse" ADD CONSTRAINT "UcasCourse_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
