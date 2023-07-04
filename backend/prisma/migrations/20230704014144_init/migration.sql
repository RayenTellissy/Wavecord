/*
  Warnings:

  - Added the required column `message` to the `DirectMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DirectMessages" ADD COLUMN     "message" STRING NOT NULL;
