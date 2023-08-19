/*
  Warnings:

  - You are about to drop the column `sender` on the `ServerMessages` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `ServerMessages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServerMessages" DROP CONSTRAINT "ServerMessages_sender_fkey";

-- AlterTable
ALTER TABLE "ServerMessages" DROP COLUMN "sender";
ALTER TABLE "ServerMessages" ADD COLUMN     "senderId" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "ServerMessages" ADD CONSTRAINT "ServerMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
