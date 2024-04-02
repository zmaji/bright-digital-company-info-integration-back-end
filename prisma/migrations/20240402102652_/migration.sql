/*
  Warnings:

  - A unique constraint covering the columns `[companyInfoUserName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyInfoPassword]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyInfoPassword" TEXT,
ADD COLUMN     "companyInfoUserName" TEXT,
ADD COLUMN     "domain" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_companyInfoUserName_key" ON "User"("companyInfoUserName");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyInfoPassword_key" ON "User"("companyInfoPassword");
