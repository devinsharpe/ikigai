import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, asc, eq, isNull } from "drizzle-orm";
import { projects } from "~/server/db/schema";
import { createId } from "~/server/db/utils";
import { TRPCError } from "@trpc/server";

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
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findFirst({
        where: and(
          eq(projects.id, input.id),
          ...(ctx.auth.orgId
            ? [eq(projects.organization, ctx.auth.orgId)]
            : [
                eq(projects.createdBy, ctx.auth.userId),
                isNull(projects.organization),
              ])
        ),
      });
      if (!project)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      await ctx.db.delete(projects).where(eq(projects.id, project.id));
      return project;
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findFirst({
        where: and(
          eq(projects.id, input.id),
          ...(ctx.auth.orgId
            ? [eq(projects.organization, ctx.auth.orgId)]
            : [
                eq(projects.createdBy, ctx.auth.userId),
                isNull(projects.organization),
              ])
        ),
      });
      return project;
    }),
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
