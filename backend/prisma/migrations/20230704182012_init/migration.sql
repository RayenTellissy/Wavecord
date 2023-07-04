/*
  Warnings:

  - You are about to drop the column `usersId` on the `DirectMessages` table. All the data in the column will be lost.
  - Added the required column `sender` to the `DirectMessages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DirectMessages" DROP CONSTRAINT "DirectMessages_usersId_fkey";

-- AlterTable
ALTER TABLE "DirectMessages" DROP COLUMN "usersId";
ALTER TABLE "DirectMessages" ADD COLUMN     "sender" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "DirectMessages" ADD CONSTRAINT "DirectMessages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
