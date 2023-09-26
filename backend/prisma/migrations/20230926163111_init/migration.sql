-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'TURBO', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ONLINE', 'BUSY', 'OFFLINE');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DIRECT', 'GROUP');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'LINK');

-- CreateTable
CREATE TABLE "Users" (
    "id" STRING NOT NULL,
    "username" STRING NOT NULL,
    "email" STRING NOT NULL,
    "image" STRING,
    "status" "Status" NOT NULL DEFAULT 'ONLINE',
    "voice_channelId" STRING,
    "muted" BOOL NOT NULL DEFAULT false,
    "deafened" BOOL NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'BASIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activeConversationId" STRING,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servers" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "image" STRING NOT NULL,
    "server_link" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" STRING NOT NULL,

    CONSTRAINT "Servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "isAdmin" BOOL NOT NULL,
    "serverId" STRING NOT NULL,
    "color" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bans" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "serverId" STRING NOT NULL,

    CONSTRAINT "Bans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedUsers" (
    "id" STRING NOT NULL,
    "blockerId" STRING NOT NULL,
    "blockedId" STRING NOT NULL,

    CONSTRAINT "BlockedUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInServers" (
    "id" STRING NOT NULL,
    "serverId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "rolesId" STRING,
    "joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersInServers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server_categories" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "serverId" STRING NOT NULL,

    CONSTRAINT "Server_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Text_channels" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "categoryId" STRING NOT NULL,
    "isPrivate" BOOL NOT NULL DEFAULT false,
    "serverId" STRING NOT NULL,

    CONSTRAINT "Text_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voice_channels" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "categoryId" STRING NOT NULL,
    "isPrivate" BOOL NOT NULL DEFAULT false,
    "serverId" STRING NOT NULL,

    CONSTRAINT "Voice_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friends" (
    "id" STRING NOT NULL,
    "conversationId" STRING,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" STRING NOT NULL,
    "senderId" STRING NOT NULL,
    "recipientId" STRING NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversations" (
    "id" STRING NOT NULL,
    "type" "ConversationType" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessages" (
    "id" STRING NOT NULL,
    "senderId" STRING NOT NULL,
    "conversationId" STRING NOT NULL,
    "message" STRING NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerMessages" (
    "id" STRING NOT NULL,
    "senderId" STRING NOT NULL,
    "channelId" STRING NOT NULL,
    "message" STRING NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectMessageNotifications" (
    "id" STRING NOT NULL,
    "senderId" STRING NOT NULL,
    "recipientId" STRING NOT NULL,
    "conversationId" STRING NOT NULL,
    "messages" INT4 NOT NULL DEFAULT 1,

    CONSTRAINT "DirectMessageNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendRequestNotifications" (
    "id" STRING NOT NULL,
    "senderId" STRING NOT NULL,
    "recipientId" STRING NOT NULL,

    CONSTRAINT "FriendRequestNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BugReports" (
    "id" STRING NOT NULL,
    "senderId" STRING NOT NULL,
    "message" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BugReports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FriendsToUsers" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "_Users" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Servers_server_link_key" ON "Servers"("server_link");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_conversationId_key" ON "Friends"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequestNotifications_senderId_key" ON "FriendRequestNotifications"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequestNotifications_recipientId_key" ON "FriendRequestNotifications"("recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "_FriendsToUsers_AB_unique" ON "_FriendsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_FriendsToUsers_B_index" ON "_FriendsToUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Users_AB_unique" ON "_Users"("A", "B");

-- CreateIndex
CREATE INDEX "_Users_B_index" ON "_Users"("B");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_voice_channelId_fkey" FOREIGN KEY ("voice_channelId") REFERENCES "Voice_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_activeConversationId_fkey" FOREIGN KEY ("activeConversationId") REFERENCES "Conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servers" ADD CONSTRAINT "Servers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bans" ADD CONSTRAINT "Bans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bans" ADD CONSTRAINT "Bans_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUsers" ADD CONSTRAINT "BlockedUsers_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedUsers" ADD CONSTRAINT "BlockedUsers_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInServers" ADD CONSTRAINT "UsersInServers_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInServers" ADD CONSTRAINT "UsersInServers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInServers" ADD CONSTRAINT "UsersInServers_rolesId_fkey" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server_categories" ADD CONSTRAINT "Server_categories_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Text_channels" ADD CONSTRAINT "Text_channels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Server_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Text_channels" ADD CONSTRAINT "Text_channels_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voice_channels" ADD CONSTRAINT "Voice_channels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Server_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voice_channels" ADD CONSTRAINT "Voice_channels_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessages" ADD CONSTRAINT "DirectMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessages" ADD CONSTRAINT "DirectMessages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMessages" ADD CONSTRAINT "ServerMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMessages" ADD CONSTRAINT "ServerMessages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Text_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessageNotifications" ADD CONSTRAINT "DirectMessageNotifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessageNotifications" ADD CONSTRAINT "DirectMessageNotifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessageNotifications" ADD CONSTRAINT "DirectMessageNotifications_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequestNotifications" ADD CONSTRAINT "FriendRequestNotifications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequestNotifications" ADD CONSTRAINT "FriendRequestNotifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReports" ADD CONSTRAINT "BugReports_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FriendsToUsers" ADD CONSTRAINT "_FriendsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Friends"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FriendsToUsers" ADD CONSTRAINT "_FriendsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Users" ADD CONSTRAINT "_Users_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Users" ADD CONSTRAINT "_Users_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
