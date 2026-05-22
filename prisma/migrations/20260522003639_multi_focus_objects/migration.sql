 -- Add new array column with empty default
  ALTER TABLE "Practice" ADD COLUMN "focusObjects"
  TEXT[] DEFAULT ARRAY[]::TEXT[];
  
  -- Backfill: wrap the existing single value into a one-element array
  UPDATE "Practice" SET "focusObjects" = ARRAY["focusObject"] WHERE "focusObject" IS NOT NULL;

  -- Drop the old single-value column
  ALTER TABLE "Practice" DROP COLUMN "focusObject";