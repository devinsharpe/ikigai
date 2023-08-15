ALTER TABLE "timerTemplates" DROP CONSTRAINT "timerTemplates_projectId_projects_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timerTemplates" ADD CONSTRAINT "timerTemplates_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
