-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "feature_image" TEXT,
    "mb_image" TEXT,
    "alt" TEXT,
    "description" TEXT,
    "date_at" TIMESTAMP(3),
    "meta_title" TEXT,
    "meta_keywords" TEXT,
    "meta_description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");
