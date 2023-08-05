ALTER TABLE "tasks" ALTER COLUMN "dueDate" SET DATA TYPE timestamp(6) with time zone;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "completedAt" SET DATA TYPE timestamp(6) with time zone;--> statement-breakpoint
ALTER TABLE "timers" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "timers" ALTER COLUMN "startedAt" SET DATA TYPE timestamp(6) with time zone;--> statement-breakpoint
ALTER TABLE "timers" ALTER COLUMN "stoppedAt" SET DATA TYPE timestamp(6) with time zone;--> statement-breakpoint
ALTER TABLE "timers" DROP COLUMN IF EXISTS "length";