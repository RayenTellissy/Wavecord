/*
  Warnings:

  - A unique constraint covering the columns `[conversationId]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Friends" ADD COLUMN     "conversationId" STRING;

-- CreateIndex
CREATE UNIQUE INDEX "Friends_conversationId_key" ON "Friends"("conversationId");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
