/*
  Warnings:

  - You are about to drop the column `accessToken` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `expiresIn` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `portalId` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `HubToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[portal_id]` on the table `HubToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[access_token]` on the table `HubToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `HubToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_in` to the `HubToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `HubToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "HubToken_accessToken_key";

-- DropIndex
DROP INDEX "HubToken_portalId_key";

-- AlterTable
ALTER TABLE "HubToken" DROP COLUMN "accessToken",
DROP COLUMN "createdAt",
DROP COLUMN "expiresIn",
DROP COLUMN "portalId",
DROP COLUMN "refreshToken",
DROP COLUMN "updatedAt",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_in" INTEGER NOT NULL,
ADD COLUMN     "portal_id" INTEGER,
ADD COLUMN     "refresh_token" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_portal_id_key" ON "HubToken"("portal_id");

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_access_token_key" ON "HubToken"("access_token");
