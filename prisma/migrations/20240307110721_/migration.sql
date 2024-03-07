/*
  Warnings:

  - You are about to drop the column `portal_id` on the `HubToken` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "HubToken_portal_id_key";

-- AlterTable
ALTER TABLE "HubToken" DROP COLUMN "portal_id",
ADD COLUMN     "message" TEXT;
