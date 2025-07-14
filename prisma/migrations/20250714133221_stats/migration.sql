-- CreateTable
CREATE TABLE "AdmissionStats" (
    "id" SERIAL NOT NULL,
    "universityId" TEXT NOT NULL,
    "applied" INTEGER NOT NULL,
    "accepted" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "AdmissionStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionStats_universityId_year_key" ON "AdmissionStats"("universityId", "year");

-- AddForeignKey
ALTER TABLE "AdmissionStats" ADD CONSTRAINT "AdmissionStats_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
