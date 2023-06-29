-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'BUSY', 'OFFLINE');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ONLINE';
