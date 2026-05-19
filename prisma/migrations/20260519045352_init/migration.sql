-- CreateTable
CREATE TABLE "Practice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "guidance" TEXT NOT NULL,
    "moodBefore" INTEGER,
    "moodAfter" INTEGER,
    "notes" TEXT,
    "yogaStyle" TEXT,
    "focusObject" TEXT,
    "position" TEXT,

    CONSTRAINT "Practice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Practice_date_idx" ON "Practice"("date");

-- CreateIndex
CREATE INDEX "Practice_type_idx" ON "Practice"("type");
