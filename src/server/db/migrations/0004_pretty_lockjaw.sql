CREATE TABLE IF NOT EXISTS "timerTemplates" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"createdBy" varchar NOT NULL,
	"projectId" varchar(25) NOT NULL,
	"organization" varchar
);
--> statement-breakpoint
ALTER TABLE "timers" ADD COLUMN "templateId" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timers" ADD CONSTRAINT "timers_templateId_timerTemplates_id_fk" FOREIGN KEY ("templateId") REFERENCES "timerTemplates"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timerTemplates" ADD CONSTRAINT "timerTemplates_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
