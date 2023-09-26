/*
  Warnings:

  - You are about to drop the `_ConversationsToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ConversationsToUsers" DROP CONSTRAINT "_ConversationsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationsToUsers" DROP CONSTRAINT "_ConversationsToUsers_B_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "activeConversationId" STRING;

-- DropTable
DROP TABLE "_ConversationsToUsers";

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_activeConversationId_fkey" FOREIGN KEY ("activeConversationId") REFERENCES "Conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
