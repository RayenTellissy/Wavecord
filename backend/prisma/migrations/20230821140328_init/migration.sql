-- CreateTable
CREATE TABLE "_Voice_channelsToroles" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Voice_channelsToroles_AB_unique" ON "_Voice_channelsToroles"("A", "B");

-- CreateIndex
CREATE INDEX "_Voice_channelsToroles_B_index" ON "_Voice_channelsToroles"("B");

-- AddForeignKey
ALTER TABLE "_Voice_channelsToroles" ADD CONSTRAINT "_Voice_channelsToroles_A_fkey" FOREIGN KEY ("A") REFERENCES "Voice_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Voice_channelsToroles" ADD CONSTRAINT "_Voice_channelsToroles_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
