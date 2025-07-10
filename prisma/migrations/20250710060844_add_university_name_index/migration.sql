-- AlterTable
CREATE SEQUENCE course_id_seq;
ALTER TABLE "Course" ALTER COLUMN "id" SET DEFAULT nextval('course_id_seq');
ALTER SEQUENCE course_id_seq OWNED BY "Course"."id";

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateIndex
CREATE INDEX "University_name_idx" ON "University" USING gin ("name" gin_trgm_ops);
