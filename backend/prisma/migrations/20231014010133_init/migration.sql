-- AlterTable
ALTER TABLE "DirectMessages" ADD COLUMN     "edited" BOOL NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ServerMessages" ADD COLUMN     "edited" BOOL NOT NULL DEFAULT false;
