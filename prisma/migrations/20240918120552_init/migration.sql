-- CreateTable
CREATE TABLE "UserLife" (
    "id" SERIAL NOT NULL,
    "tg_id" INTEGER NOT NULL,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "caption" TEXT,
    "photosEditing" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "UserLife_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserLife_tg_id_key" ON "UserLife"("tg_id");
