-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN     "forkCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "forkedFromId" TEXT;

-- CreateIndex
CREATE INDEX "Snippet_forkedFromId_idx" ON "Snippet"("forkedFromId");

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_forkedFromId_fkey" FOREIGN KEY ("forkedFromId") REFERENCES "Snippet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
