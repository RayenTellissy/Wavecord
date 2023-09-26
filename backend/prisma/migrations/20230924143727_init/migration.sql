/*
  Warnings:

  - You are about to drop the `_UsersInRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UsersInRoom" DROP CONSTRAINT "_UsersInRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsersInRoom" DROP CONSTRAINT "_UsersInRoom_B_fkey";

-- DropTable
DROP TABLE "_UsersInRoom";

-- CreateTable
CREATE TABLE "_ConversationsToUsers" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationsToUsers_AB_unique" ON "_ConversationsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationsToUsers_B_index" ON "_ConversationsToUsers"("B");

-- AddForeignKey
ALTER TABLE "_ConversationsToUsers" ADD CONSTRAINT "_ConversationsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationsToUsers" ADD CONSTRAINT "_ConversationsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
