/*
  Warnings:

  - A unique constraint covering the columns `[server_link]` on the table `Servers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Servers_server_link_key" ON "Servers"("server_link");
