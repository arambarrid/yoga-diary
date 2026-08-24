/*
  Warnings:

  - You are about to drop the column `moodAfter` on the `Practice` table. All the data in the column will be lost.
  - You are about to drop the column `moodBefore` on the `Practice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Practice" DROP COLUMN "moodAfter",
DROP COLUMN "moodBefore";
