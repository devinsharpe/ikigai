CREATE TABLE IF NOT EXISTS "images" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"userFullName" varchar NOT NULL,
	"userUrl" varchar NOT NULL,
	"description" varchar NOT NULL,
	"downloadUrl" varchar NOT NULL,
	"htmlUrl" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "imageId" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
