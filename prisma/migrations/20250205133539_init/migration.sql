-- CreateTable
CREATE TABLE "Olympiad" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Olympiad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Olympiad_Resource" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "olympiadId" INTEGER NOT NULL,

    CONSTRAINT "Olympiad_Resource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Olympiad_Resource" ADD CONSTRAINT "Olympiad_Resource_olympiadId_fkey" FOREIGN KEY ("olympiadId") REFERENCES "Olympiad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
