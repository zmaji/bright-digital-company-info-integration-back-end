/*
  Warnings:

  - You are about to drop the column `message` on the `HubToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[portal_id]` on the table `HubToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HubToken" DROP COLUMN "message",
ADD COLUMN     "portal_id" INTEGER,
ALTER COLUMN "created_at" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_portal_id_key" ON "HubToken"("portal_id");
