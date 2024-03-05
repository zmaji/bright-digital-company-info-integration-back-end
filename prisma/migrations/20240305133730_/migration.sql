/*
  Warnings:

  - A unique constraint covering the columns `[access_token]` on the table `HubToken` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `portal_id` on the `HubToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "HubToken" DROP COLUMN "portal_id",
ADD COLUMN     "portal_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_portal_id_key" ON "HubToken"("portal_id");

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_access_token_key" ON "HubToken"("access_token");
