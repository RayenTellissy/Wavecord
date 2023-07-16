-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'LINK');

-- AlterTable
ALTER TABLE "DirectMessages" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT';
