/*
  Warnings:

  - You are about to drop the column `isBanned` on the `UsersInServers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersInServers" DROP COLUMN "isBanned";

-- CreateTable
CREATE TABLE "Bans" (
    "id" STRING NOT NULL,
    "usersId" STRING NOT NULL,
    "serversId" STRING NOT NULL,

    CONSTRAINT "Bans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bans" ADD CONSTRAINT "Bans_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bans" ADD CONSTRAINT "Bans_serversId_fkey" FOREIGN KEY ("serversId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
