/*
  Warnings:

  - Added the required column `conversationId` to the `DirectMessageNotifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DirectMessageNotifications" ADD COLUMN     "conversationId" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "DirectMessageNotifications" ADD CONSTRAINT "DirectMessageNotifications_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
