-- CreateTable
CREATE TABLE "BugReports" (
    "id" STRING NOT NULL,
    "senderId" STRING NOT NULL,
    "message" STRING NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BugReports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BugReports" ADD CONSTRAINT "BugReports_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
