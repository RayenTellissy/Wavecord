/*
  Warnings:

  - Added the required column `color` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "color" STRING NOT NULL;
