ALTER TABLE "tasks" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "completedBy" varchar;