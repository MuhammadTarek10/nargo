-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('Customer', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "role" "UserRoles" NOT NULL DEFAULT 'Customer',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
