-- CreateTable
CREATE TABLE "Friends" (
    "id" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FriendsToUsers" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FriendsToUsers_AB_unique" ON "_FriendsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_FriendsToUsers_B_index" ON "_FriendsToUsers"("B");

-- AddForeignKey
ALTER TABLE "_FriendsToUsers" ADD CONSTRAINT "_FriendsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Friends"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FriendsToUsers" ADD CONSTRAINT "_FriendsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
