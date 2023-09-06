/*
  Warnings:

  - You are about to drop the column `serversId` on the `Bans` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `Bans` table. All the data in the column will be lost.
  - Added the required column `serverId` to the `Bans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Bans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bans" DROP CONSTRAINT "Bans_serversId_fkey";

-- DropForeignKey
ALTER TABLE "Bans" DROP CONSTRAINT "Bans_usersId_fkey";

-- AlterTable
ALTER TABLE "Bans" DROP COLUMN "serversId";
ALTER TABLE "Bans" DROP COLUMN "usersId";
ALTER TABLE "Bans" ADD COLUMN     "serverId" STRING NOT NULL;
ALTER TABLE "Bans" ADD COLUMN     "userId" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "Bans" ADD CONSTRAINT "Bans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bans" ADD CONSTRAINT "Bans_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
