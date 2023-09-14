/*
  Warnings:

  - You are about to drop the column `conversationsId` on the `DirectMessages` table. All the data in the column will be lost.
  - You are about to drop the column `sender` on the `DirectMessages` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `DirectMessages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `DirectMessages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DirectMessages" DROP CONSTRAINT "DirectMessages_conversationsId_fkey";

-- DropForeignKey
ALTER TABLE "DirectMessages" DROP CONSTRAINT "DirectMessages_sender_fkey";

-- AlterTable
ALTER TABLE "DirectMessages" DROP COLUMN "conversationsId";
ALTER TABLE "DirectMessages" DROP COLUMN "sender";
ALTER TABLE "DirectMessages" ADD COLUMN     "conversationId" STRING NOT NULL;
ALTER TABLE "DirectMessages" ADD COLUMN     "senderId" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "DirectMessages" ADD CONSTRAINT "DirectMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessages" ADD CONSTRAINT "DirectMessages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
