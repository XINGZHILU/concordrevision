-- Step 1: Rename Course enum to UCASSubjectType
ALTER TYPE "CourseType" RENAME TO "UCASSubjectType";

-- Step 2: Rename Course table to UCASSubject
ALTER TABLE "Course" RENAME TO "UCASSubject";

-- Step 3: Rename CourseLink table to Course
ALTER TABLE "CourseLink" RENAME TO "Course";

-- Step 4: Update Course table foreign key constraint names and column names
-- Rename courseId to ucasSubjectId
ALTER TABLE "Course" RENAME COLUMN "courseId" TO "ucasSubjectId";

-- Drop old constraint and add new one with updated name
ALTER TABLE "Course" DROP CONSTRAINT "CourseLink_courseId_fkey";
ALTER TABLE "Course" ADD CONSTRAINT "Course_ucasSubjectId_fkey" FOREIGN KEY ("ucasSubjectId") REFERENCES "UCASSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old constraint and add new one with updated name for university
ALTER TABLE "Course" DROP CONSTRAINT "CourseLink_universityId_fkey";
ALTER TABLE "Course" ADD CONSTRAINT "Course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 5: Drop the old unique constraint and create a new one with correct name
-- Check if constraint exists first
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'CourseLink_universityId_courseId_key'
    ) THEN
        ALTER TABLE "Course" DROP CONSTRAINT "CourseLink_universityId_courseId_key";
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Course_universityId_ucasSubjectId_key'
    ) THEN
        ALTER TABLE "Course" ADD CONSTRAINT "Course_universityId_ucasSubjectId_key" UNIQUE ("universityId", "ucasSubjectId");
    END IF;
END $$;

-- Step 6: Rename courses column to ucasSubjects in UCASPost table
ALTER TABLE "UCASPost" RENAME COLUMN "courses" TO "ucasSubjects";

