-- Migration script to add raw_text column to resumes table
-- Run this script if you have an existing database without the raw_text column

-- Add raw_text column to resumes table
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS raw_text TEXT;

-- Add comment to document the column
COMMENT ON COLUMN resumes.raw_text IS 'Original resume text before parsing into structured data';

-- Update any existing records to have empty raw_text if they don't have it
UPDATE resumes SET raw_text = '' WHERE raw_text IS NULL;

