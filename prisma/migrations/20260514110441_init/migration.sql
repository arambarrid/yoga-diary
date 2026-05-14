-- CreateTable
CREATE TABLE "Practice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "guidance" TEXT NOT NULL,
    "moodBefore" INTEGER,
    "moodAfter" INTEGER,
    "notes" TEXT,
    "yogaStyle" TEXT,
    "focusObject" TEXT,
    "position" TEXT
);

-- CreateIndex
CREATE INDEX "Practice_date_idx" ON "Practice"("date");

-- CreateIndex
CREATE INDEX "Practice_type_idx" ON "Practice"("type");
