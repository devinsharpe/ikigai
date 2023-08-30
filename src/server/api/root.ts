import { exampleRouter } from "~/server/api/routers/example";
import { projectsRouter } from "~/server/api/routers/projects";
import { timersRouter } from "~/server/api/routers/timers";
import { timerTemplatesRouter } from "~/server/api/routers/timers/templates";
import { createTRPCRouter } from "~/server/api/trpc";
import { tasksRouter } from "./routers/tasks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  projects: projectsRouter,
  tasks: tasksRouter,
  timers: timersRouter,
  timerTemplates: timerTemplatesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
