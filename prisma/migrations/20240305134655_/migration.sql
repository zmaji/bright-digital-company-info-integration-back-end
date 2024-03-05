/*
  Warnings:

  - A unique constraint covering the columns `[portal_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `portal_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "HubToken_portal_id_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "portal_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_portal_id_key" ON "User"("portal_id");
