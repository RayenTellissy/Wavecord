/*
  Warnings:

  - Added the required column `name` to the `Server_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Server_categories" ADD COLUMN     "name" STRING NOT NULL;
