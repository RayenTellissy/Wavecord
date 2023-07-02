-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "deafened" BOOL NOT NULL DEFAULT false;
ALTER TABLE "Users" ADD COLUMN     "muted" BOOL NOT NULL DEFAULT false;
