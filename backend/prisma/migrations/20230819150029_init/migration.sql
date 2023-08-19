-- AlterTable
ALTER TABLE "Text_channels" ADD COLUMN     "isPrivate" BOOL NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Voice_channels" ADD COLUMN     "isPrivate" BOOL NOT NULL DEFAULT false;
