import { TRPCError } from "@trpc/server";
import { and, asc, eq, isNull, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { projects, tasks } from "~/server/db/schema";
import { createId } from "~/server/db/utils";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { projectAccessGuard } from "../utils";

const resetDate = (date: Date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
};

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable().optional(),
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
      return project ?? null;
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
  listCompletionGraph: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await projectAccessGuard(ctx, input.projectId);
      const today = new Date();
      resetDate(today);
      const filterDate = new Date();
      filterDate.setFullYear(filterDate.getFullYear() - 1);
      resetDate(filterDate);
      const dayCount = Math.floor(
        (today.getTime() - filterDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const counts = await ctx.db
        .select({
          day: sql<string>`DATE_TRUNC('day', ${tasks.completedAt})`,
          count: sql<string>`count(id)`,
        })
        .from(tasks)
        .where(
          and(
            eq(tasks.projectId, input.projectId),
            gte(tasks.completedAt, filterDate.toISOString())
          )
        )
        .groupBy(sql`DATE_TRUNC('day', ${tasks.completedAt})`);
      const dayMap = counts.reduce<Record<string, number>>((acc, curr) => {
        return {
          ...acc,
          [curr.day.substring(0, 10)]: parseInt(curr.count, 10),
        };
      }, {});
      const result: {
        day: string;
        count: number;
      }[] = [];
      new Array(dayCount).fill(0).forEach((_, index) => {
        const day = new Date(today.getTime());
        day.setDate(day.getDate() - index);
        const dayString = day.toISOString().split("T")[0]!;
        result.unshift(
          dayMap[dayString]
            ? {
                day: dayString,
                count: dayMap[dayString]!,
              }
            : {
                day: dayString,
                count: 0,
              }
        );
      });
      return result;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().nullable().optional(),
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
      const updatedProject = await ctx.db
        .update(projects)
        .set(input)
        .where(eq(projects.id, input.id))
        .returning();
      return updatedProject;
    }),
});
