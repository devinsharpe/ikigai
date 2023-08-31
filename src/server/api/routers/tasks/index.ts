import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, gte, isNull, lt, or } from "drizzle-orm";
import { z } from "zod";
import { tasks } from "~/server/db/schema";
import { createId } from "~/server/db/utils";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { projectAccessGuard } from "../../utils";

// create ✅
// update ✅
// delete ✅
// complete ✅
// list
// list-today ✅
// list-upcoming ✅
// list-inbox
// list-completed ✅

function getFilterDate(timezoneOffset: number) {
  const filterDate = new Date();
  filterDate.setDate(filterDate.getDate() + 1);
  filterDate.setHours(0);
  filterDate.setMinutes(0);
  filterDate.setMinutes(timezoneOffset - filterDate.getTimezoneOffset());
  filterDate.setSeconds(0);
  filterDate.setMilliseconds(0);
  return filterDate;
}

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable().optional(),
        priority: z.number().optional(),
        dueDate: z.string().nullable().optional(),
        projectId: z.string(),
        assignedTo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await projectAccessGuard(ctx, input.projectId);
      const task = await ctx.db
        .insert(tasks)
        .values({
          ...input,
          id: createId(),
          organization: ctx.auth.orgId,
          createdAt: new Date().toISOString(),
          createdBy: ctx.auth.userId,
          assignedBy: ctx.auth.userId,
          assignedTo: input.assignedTo ?? ctx.auth.userId,
          assignedAt: new Date().toISOString(),
        })
        .returning();
      return task;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.query.tasks.findFirst({
        where: and(
          eq(tasks.id, input.id),
          or(
            eq(tasks.createdBy, ctx.auth.userId),
            eq(tasks.assignedTo, ctx.auth.userId),
            eq(tasks.assignedBy, ctx.auth.userId)
          )
        ),
      });
      if (!task)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      await ctx.db.delete(tasks).where(eq(tasks.id, task.id));
      return task;
    }),
  listCompleted: protectedProcedure
    .input(
      z.object({
        timezoneOffset: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filterDate = getFilterDate(input.timezoneOffset);
      filterDate.setDate(filterDate.getDate() - 7);
      const completedTasks = await ctx.db.query.tasks.findMany({
        where: and(
          eq(tasks.completedBy, ctx.auth.userId),
          gte(tasks.completedAt, filterDate.toISOString()),
          ...(ctx.auth.orgId
            ? [eq(tasks.organization, ctx.auth.orgId)]
            : [isNull(tasks.organization)])
        ),
        orderBy: desc(tasks.completedAt),
        with: {
          project: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
        limit: 50,
      });
      return completedTasks;
    }),
  listToday: protectedProcedure
    .input(
      z.object({
        timezoneOffset: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filterDate = getFilterDate(input.timezoneOffset);
      const todayTasks = await ctx.db.query.tasks.findMany({
        where: and(
          eq(tasks.assignedTo, ctx.auth.userId),
          isNull(tasks.completedAt),
          lt(tasks.dueDate, filterDate.toISOString()),
          ...(ctx.auth.orgId
            ? [eq(tasks.organization, ctx.auth.orgId)]
            : [isNull(tasks.organization)])
        ),
        orderBy: [asc(tasks.dueDate), asc(tasks.name)],
        with: {
          project: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });
      return todayTasks;
    }),
  listUpcoming: protectedProcedure
    .input(
      z.object({
        timezoneOffset: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const filterDate = getFilterDate(input.timezoneOffset);
      const upcomingTasks = await ctx.db.query.tasks.findMany({
        where: and(
          eq(tasks.assignedTo, ctx.auth.userId),
          isNull(tasks.completedAt),
          gte(tasks.dueDate, filterDate.toISOString()),
          ...(ctx.auth.orgId
            ? [eq(tasks.organization, ctx.auth.orgId)]
            : [isNull(tasks.organization)])
        ),
        orderBy: [asc(tasks.dueDate), asc(tasks.name)],
        with: {
          project: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });
      return upcomingTasks;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().nullable().optional(),
        priority: z.number().optional(),
        dueDate: z.string().nullable().optional(),
        projectId: z.string().optional(),
        assignedTo: z.string().optional(),
        completedAt: z.string().nullable().optional(),
        completedBy: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.projectId) await projectAccessGuard(ctx, input.projectId);
      const task = await ctx.db.query.tasks.findFirst({
        where: and(
          eq(tasks.id, input.id),
          or(
            eq(tasks.createdBy, ctx.auth.userId),
            eq(tasks.assignedTo, ctx.auth.userId),
            eq(tasks.assignedBy, ctx.auth.userId)
          )
        ),
      });
      if (!task)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      const updatedTask = await ctx.db
        .update(tasks)
        .set(input)
        .where(eq(tasks.id, task.id))
        .returning();
      return updatedTask;
    }),
});
