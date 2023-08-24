-- AlterTable
ALTER TABLE "UsersInServers" ADD COLUMN     "rolesId" STRING;

-- AddForeignKey
ALTER TABLE "UsersInServers" ADD CONSTRAINT "UsersInServers_rolesId_fkey" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
