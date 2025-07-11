-- CreateTable
CREATE TABLE "UserSubjectSubscription" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "UserSubjectSubscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSubjectSubscription" ADD CONSTRAINT "UserSubjectSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubjectSubscription" ADD CONSTRAINT "UserSubjectSubscription_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
