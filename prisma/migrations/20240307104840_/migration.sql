/*
  Warnings:

  - You are about to drop the column `portalId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hubSpotPortalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_portalId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "portalId",
ADD COLUMN     "hubSpotPortalId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_hubSpotPortalId_key" ON "User"("hubSpotPortalId");
