DO $$ BEGIN
 CREATE TYPE "projectVisibility" AS ENUM('PRIVATE', 'PUBLIC_VIEW', 'PUBLIC_EDIT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"organization" varchar NOT NULL
);
