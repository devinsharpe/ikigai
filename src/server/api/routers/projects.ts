import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, asc, eq, isNull } from "drizzle-orm";
import { projects } from "~/server/db/schema";
import { createId } from "~/server/db/utils";

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newProject = await ctx.db
        .insert(projects)
        .values({
          ...input,
          id: createId(),
          createdAt: new Date().toUTCString(),
          createdBy: ctx.auth.userId,
          organization: ctx.auth.orgId,
        })
        .returning();
      return newProject;
    }),
  // TODO: adjust query requirements
  list: protectedProcedure.query(async ({ ctx }) => {
    const projectList = await ctx.db.query.projects.findMany({
      where: and(
        eq(projects.isActive, true),
        ...(ctx.auth.orgId
          ? [eq(projects.organization, ctx.auth.orgId)]
          : [
              eq(projects.createdBy, ctx.auth.userId),
              isNull(projects.organization),
            ])
      ),
      orderBy: [asc(projects.name)],
    });
    return projectList;
  }),
});
