-- CreateTable
CREATE TABLE "Fork" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalId" TEXT NOT NULL,
    "forkedId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Fork_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fork_forkedId_key" ON "Fork"("forkedId");

-- CreateIndex
CREATE INDEX "Fork_originalId_idx" ON "Fork"("originalId");

-- CreateIndex
CREATE INDEX "Fork_userId_idx" ON "Fork"("userId");

-- AddForeignKey
ALTER TABLE "Fork" ADD CONSTRAINT "Fork_originalId_fkey" FOREIGN KEY ("originalId") REFERENCES "Snippet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fork" ADD CONSTRAINT "Fork_forkedId_fkey" FOREIGN KEY ("forkedId") REFERENCES "Snippet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fork" ADD CONSTRAINT "Fork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
