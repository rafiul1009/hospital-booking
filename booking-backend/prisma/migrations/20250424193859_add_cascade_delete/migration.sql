-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_hospitalId_fkey";

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;
