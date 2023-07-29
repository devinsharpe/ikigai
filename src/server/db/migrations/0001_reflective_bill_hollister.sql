CREATE TABLE IF NOT EXISTS "tasks" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"priority" smallint DEFAULT 0,
	"dueDate" timestamp with time zone,
	"completedAt" timestamp with time zone,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp with time zone DEFAULT now(),
	"createdBy" varchar NOT NULL,
	"projectId" varchar(25) NOT NULL,
	"organization" varchar NOT NULL,
	"assignedTo" varchar NOT NULL,
	"assignedBy" varchar NOT NULL,
	"assignedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timers" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"name" varchar,
	"description" varchar,
	"startedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"stoppedAt" timestamp with time zone,
	"length" integer DEFAULT -1,
	"createdAt" timestamp with time zone DEFAULT now(),
	"createdBy" varchar NOT NULL,
	"projectId" varchar(25) NOT NULL,
	"organization" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "isActive" boolean DEFAULT true;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timers" ADD CONSTRAINT "timers_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
