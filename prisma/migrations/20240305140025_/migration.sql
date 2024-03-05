/*
  Warnings:

  - You are about to drop the column `access_token` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `expires_in` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `portal_id` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `HubToken` table. All the data in the column will be lost.
  - You are about to drop the column `email_address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `portal_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accessToken]` on the table `HubToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[portalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `HubToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresIn` to the `HubToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portalId` to the `HubToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `HubToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailAddress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `portalId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "HubToken_access_token_key";

-- DropIndex
DROP INDEX "User_email_address_key";

-- DropIndex
DROP INDEX "User_portal_id_key";

-- AlterTable
ALTER TABLE "HubToken" DROP COLUMN "access_token",
DROP COLUMN "created_at",
DROP COLUMN "expires_in",
DROP COLUMN "portal_id",
DROP COLUMN "refresh_token",
DROP COLUMN "updated_at",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresIn" INTEGER NOT NULL,
ADD COLUMN     "portalId" INTEGER NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email_address",
DROP COLUMN "portal_id",
ADD COLUMN     "emailAddress" TEXT NOT NULL,
ADD COLUMN     "portalId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_accessToken_key" ON "HubToken"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_portalId_key" ON "User"("portalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");
