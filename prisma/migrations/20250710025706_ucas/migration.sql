-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uk" BOOLEAN NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
