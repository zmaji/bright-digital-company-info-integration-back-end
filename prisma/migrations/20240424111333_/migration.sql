/*
  Warnings:

  - You are about to drop the column `value` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "value",
ADD COLUMN     "toSave" BOOLEAN NOT NULL DEFAULT false;
