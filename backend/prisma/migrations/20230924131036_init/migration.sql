/*
  Warnings:

  - You are about to drop the column `notificationId` on the `DirectMessageNotifications` table. All the data in the column will be lost.
  - You are about to drop the `Notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NotificationsToServers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DirectMessageNotifications" DROP CONSTRAINT "DirectMessageNotifications_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "_NotificationsToServers" DROP CONSTRAINT "_NotificationsToServers_A_fkey";

-- DropForeignKey
ALTER TABLE "_NotificationsToServers" DROP CONSTRAINT "_NotificationsToServers_B_fkey";

-- AlterTable
ALTER TABLE "DirectMessageNotifications" DROP COLUMN "notificationId";

-- DropTable
DROP TABLE "Notifications";

-- DropTable
DROP TABLE "_NotificationsToServers";
