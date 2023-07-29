ALTER TABLE "projects" ALTER COLUMN "organization" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "organization" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "timers" ALTER COLUMN "organization" DROP NOT NULL;