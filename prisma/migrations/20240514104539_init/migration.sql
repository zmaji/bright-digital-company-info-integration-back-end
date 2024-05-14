-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "hubSpotPortalId" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "domain" TEXT,
    "password" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "roles" TEXT[],
    "activationToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "companyInfoUserName" TEXT,
    "companyInfoPassword" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HubToken" (
    "id" SERIAL NOT NULL,
    "portal_id" INTEGER,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "HubToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "toSave" BOOLEAN NOT NULL DEFAULT false,
    "portalId" INTEGER NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_activationToken_key" ON "User"("activationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyInfoUserName_key" ON "User"("companyInfoUserName");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyInfoPassword_key" ON "User"("companyInfoPassword");

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_portal_id_key" ON "HubToken"("portal_id");

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_access_token_key" ON "HubToken"("access_token");
