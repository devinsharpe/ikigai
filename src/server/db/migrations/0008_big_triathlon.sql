DO $$ BEGIN
 CREATE TYPE "projectThemeColor" AS ENUM('Zinc', 'Red', 'Orange', 'Amber', 'Lime', 'Emerald', 'Cyan', 'Blue', 'Violet', 'Pink');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "themeColor" "projectThemeColor" DEFAULT 'Zinc' NOT NULL;