/*
  Warnings:

  - Added the required column `serverId` to the `Text_channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverId` to the `Voice_channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Text_channels" ADD COLUMN     "serverId" STRING NOT NULL;

-- AlterTable
ALTER TABLE "Voice_channels" ADD COLUMN     "serverId" STRING NOT NULL;

-- AddForeignKey
ALTER TABLE "Text_channels" ADD CONSTRAINT "Text_channels_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voice_channels" ADD CONSTRAINT "Voice_channels_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
