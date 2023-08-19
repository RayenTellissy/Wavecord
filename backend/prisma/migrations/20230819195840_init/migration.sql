-- AlterTable
ALTER TABLE "ServerMessages" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'TEXT';

-- CreateTable
CREATE TABLE "UsersInRoles" (
    "id" STRING NOT NULL,
    "roleId" STRING NOT NULL,
    "userId" STRING NOT NULL,

    CONSTRAINT "UsersInRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Text_channelsToroles" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Text_channelsToroles_AB_unique" ON "_Text_channelsToroles"("A", "B");

-- CreateIndex
CREATE INDEX "_Text_channelsToroles_B_index" ON "_Text_channelsToroles"("B");

-- AddForeignKey
ALTER TABLE "UsersInRoles" ADD CONSTRAINT "UsersInRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInRoles" ADD CONSTRAINT "UsersInRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Text_channelsToroles" ADD CONSTRAINT "_Text_channelsToroles_A_fkey" FOREIGN KEY ("A") REFERENCES "Text_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Text_channelsToroles" ADD CONSTRAINT "_Text_channelsToroles_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
