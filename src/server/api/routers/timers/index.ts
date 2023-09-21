import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { timers } from "~/server/db/schema";
import { createId } from "~/server/db/utils";
import { and, eq, desc, isNull, ne } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { projectAccessGuard } from "../../utils";

// list-commitment-graph

export const timersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        startedAt: z.string().optional(),
        stoppedAt: z.string().optional(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await projectAccessGuard(ctx, input.projectId);
      const timer = await ctx.db
        .insert(timers)
        .values({
          ...input,
          id: createId(),
          startedAt: input.startedAt ?? "",
          createdBy: ctx.auth.userId,
          createdAt: new Date().toISOString(),
          organization: ctx.auth.orgId,
        })
        .returning();
      if (timer[0] && !timer[0].stoppedAt) {
        await ctx.db
          .update(timers)
          .set({
            stoppedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(timers.createdBy, ctx.auth.userId),
              isNull(timers.stoppedAt),
              ne(timers.id, timer[0]!.id)
            )
          );
      }
      return timer;
    }),
  current: protectedProcedure.query(async ({ ctx }) => {
    const timer = await ctx.db.query.timers.findFirst({
      where: and(
        eq(timers.createdBy, ctx.auth.userId),
        isNull(timers.stoppedAt)
      ),
      with: {
        project: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    return timer ?? null;
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const timer = await ctx.db.query.timers.findFirst({
        where: and(
          eq(timers.id, input.id),
          eq(timers.createdBy, ctx.auth.userId)
        ),
      });
      if (!timer)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timer not found",
        });
      await ctx.db.delete(timers).where(eq(timers.id, timer.id));
      return timer;
    }),
  list: protectedProcedure
    .input(
      z
        .object({
          projectId: z.string(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const timerList = await ctx.db.query.timers.findMany({
        where: and(
          eq(timers.createdBy, ctx.auth.userId),
          ...(ctx.auth.orgId
            ? [eq(timers.organization, ctx.auth.orgId)]
            : [isNull(timers.organization)]),
          ...(input ? [eq(timers.projectId, input.projectId)] : [])
        ),
        orderBy: [desc(timers.startedAt)],
        with: {
          project: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      });
      return timerList;
    }),
  stop: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const timer = await ctx.db.query.timers.findFirst({
        where: and(
          eq(timers.id, input.id),
          eq(timers.createdBy, ctx.auth.userId)
        ),
      });
      if (!timer)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timer not found",
        });
      if (timer.stoppedAt) return timer;
      const updatedTimer = await ctx.db
        .update(timers)
        .set({ stoppedAt: new Date().toISOString() })
        .where(eq(timers.id, timer.id))
        .returning();
      return updatedTimer[0]!;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        startedAt: z.string().optional(),
        stoppedAt: z.string().optional(),
        projectId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.projectId) await projectAccessGuard(ctx, input.projectId);
      const timer = await ctx.db.query.timers.findFirst({
        where: and(
          eq(timers.id, input.id),
          eq(timers.createdBy, ctx.auth.userId)
        ),
      });
      if (!timer)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timer not found",
        });
      const updatedTimer = await ctx.db
        .update(timers)
        .set(input)
        .where(eq(timers.id, timer.id))
        .returning();
      return updatedTimer;
    }),
});
