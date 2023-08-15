-- CreateTable
CREATE TABLE "roles" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "isAdmin" BOOL NOT NULL,
    "serverId" STRING NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Text_channels" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "serverId" STRING NOT NULL,

    CONSTRAINT "Text_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerMessages" (
    "id" STRING NOT NULL,
    "sender" STRING NOT NULL,
    "channelId" STRING NOT NULL,
    "message" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Text_channels" ADD CONSTRAINT "Text_channels_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Servers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMessages" ADD CONSTRAINT "ServerMessages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerMessages" ADD CONSTRAINT "ServerMessages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Text_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
