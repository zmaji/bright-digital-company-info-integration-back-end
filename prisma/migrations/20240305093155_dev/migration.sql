-- CreateTable
CREATE TABLE "HubToken" (
    "id" SERIAL NOT NULL,
    "portal_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_in" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "HubToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HubToken_portal_id_key" ON "HubToken"("portal_id");
