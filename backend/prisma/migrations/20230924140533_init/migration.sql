/*
  Warnings:

  - You are about to drop the `_ConversationsToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ConversationsToUsers" DROP CONSTRAINT "_ConversationsToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationsToUsers" DROP CONSTRAINT "_ConversationsToUsers_B_fkey";

-- DropTable
DROP TABLE "_ConversationsToUsers";

-- CreateTable
CREATE TABLE "_Users" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "_UsersInRoom" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Users_AB_unique" ON "_Users"("A", "B");

-- CreateIndex
CREATE INDEX "_Users_B_index" ON "_Users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UsersInRoom_AB_unique" ON "_UsersInRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersInRoom_B_index" ON "_UsersInRoom"("B");

-- AddForeignKey
ALTER TABLE "_Users" ADD CONSTRAINT "_Users_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Users" ADD CONSTRAINT "_Users_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersInRoom" ADD CONSTRAINT "_UsersInRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersInRoom" ADD CONSTRAINT "_UsersInRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
