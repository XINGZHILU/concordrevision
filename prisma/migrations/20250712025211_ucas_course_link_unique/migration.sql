/*
  Warnings:

  - A unique constraint covering the columns `[universityId,courseId]` on the table `CourseLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseLink_universityId_courseId_key" ON "CourseLink"("universityId", "courseId");
