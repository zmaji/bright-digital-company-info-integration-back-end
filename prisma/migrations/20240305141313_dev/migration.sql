/*
  Warnings:

  - A unique constraint covering the columns `[portalId]` on the table `HubToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[portalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HubToken_portalId_key" ON "HubToken"("portalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_portalId_key" ON "User"("portalId");
