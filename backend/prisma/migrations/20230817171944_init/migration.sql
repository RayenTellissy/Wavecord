/*
  Warnings:

  - The values [SERVER] on the enum `ConversationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `serverId` on the `Text_channels` table. All the data in the column will be lost.
  - You are about to drop the column `serverId` on the `Voice_channels` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Text_channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Voice_channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ConversationType"DROP VALUE 'SERVER';

-- DropForeignKey
ALTER TABLE "Text_channels" DROP CONSTRAINT "Text_channels_serverId_fkey";

-- DropForeignKey
ALTER TABLE "Voice_channels" DROP CONSTRAINT "Voice_channels_serverId_fkey";

-- AlterTable
ALTER TABLE "Text_channels" DROP COLUMN "serverId";
ALTER TABLE "Text_channels" ADD COLUMN     "categoryId" STRING NOT NULL;

-- AlterTable
ALTER TABLE "Voice_channels" DROP COLUMN "serverId";
ALTER TABLE "Voice_channels" ADD COLUMN     "categoryId" STRING NOT NULL;

-- CreateTable
CREATE TABLE "Server_categories" (
    "id" STRING NOT NULL,
    "serverId" STRING NOT NULL,

    CONSTRAINT "Server_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Server_categories" ADD CONSTRAINT "Server_categories_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Text_channels" ADD CONSTRAINT "Text_channels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Server_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voice_channels" ADD CONSTRAINT "Voice_channels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Server_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
