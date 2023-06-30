-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'TURBO', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'BUSY', 'OFFLINE');

-- CreateTable
CREATE TABLE "Users" (
    "id" STRING NOT NULL,
    "username" STRING NOT NULL,
    "email" STRING NOT NULL,
    "image" STRING,
    "role" "Role" NOT NULL DEFAULT 'BASIC',
    "status" "Status" NOT NULL DEFAULT 'ONLINE',
    "voice_channelId" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servers" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "image" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "server_link" STRING NOT NULL,

    CONSTRAINT "Servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInServers" (
    "usersId" STRING NOT NULL,
    "serversId" STRING NOT NULL,
    "isBanned" BOOL NOT NULL DEFAULT false,
    "joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Voice_channels" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "serverId" STRING NOT NULL,

    CONSTRAINT "Voice_channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UsersInServers_usersId_serversId_key" ON "UsersInServers"("usersId", "serversId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_voice_channelId_fkey" FOREIGN KEY ("voice_channelId") REFERENCES "Voice_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInServers" ADD CONSTRAINT "UsersInServers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInServers" ADD CONSTRAINT "UsersInServers_serversId_fkey" FOREIGN KEY ("serversId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voice_channels" ADD CONSTRAINT "Voice_channels_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
