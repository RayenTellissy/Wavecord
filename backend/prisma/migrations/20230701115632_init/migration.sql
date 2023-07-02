-- AlterTable
ALTER TABLE "Servers" ADD COLUMN     "ownerId" STRING NOT NULL DEFAULT 'test';

-- AddForeignKey
ALTER TABLE "Servers" ADD CONSTRAINT "Servers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
