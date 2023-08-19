ALTER TABLE "tasks" ADD COLUMN "activeAt" timestamp(6) with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "tasks" DROP COLUMN IF EXISTS "isActive";