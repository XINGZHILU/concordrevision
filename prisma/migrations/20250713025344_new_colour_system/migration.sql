-- CreateEnum
CREATE TYPE "Colour" AS ENUM ('Unclassified', 'Red', 'Amber', 'Green');

-- CreateTable
CREATE TABLE "ColourLink" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "noteId" INTEGER NOT NULL,
    "colour" "Colour" NOT NULL,

    CONSTRAINT "ColourLink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ColourLink" ADD CONSTRAINT "ColourLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColourLink" ADD CONSTRAINT "ColourLink_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColourLink" ADD CONSTRAINT "ColourLink_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
