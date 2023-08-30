import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { projectAccessGuard } from "../../utils";
import { TRPCError } from "@trpc/server";
import { timerTemplates } from "~/server/db/schema";
import { createId } from "~/server/db/utils";
import { and, eq, asc, isNull } from "drizzle-orm";

export const timerTemplatesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await projectAccessGuard(ctx, input.projectId);
      const template = await ctx.db
        .insert(timerTemplates)
        .values({
          ...input,
          id: createId(),
          createdBy: ctx.auth.userId,
          organization: ctx.auth.orgId,
        })
        .returning();
      return template;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const timerTemplate = await ctx.db.query.timerTemplates.findFirst({
        where: and(
          eq(timerTemplates.id, input.id),
          eq(timerTemplates.createdBy, ctx.auth.userId)
        ),
      });
      if (!timerTemplate)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timer template not found",
        });
      await ctx.db
        .delete(timerTemplates)
        .where(eq(timerTemplates.id, timerTemplate.id));
      return timerTemplate;
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    const templateList = await ctx.db.query.timerTemplates.findMany({
      where: and(
        eq(timerTemplates.createdBy, ctx.auth.userId),
        ...(ctx.auth.orgId
          ? [eq(timerTemplates.organization, ctx.auth.orgId)]
          : [isNull(timerTemplates.organization)])
      ),
      orderBy: [asc(timerTemplates.name)],
      with: {
        project: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
    return templateList;
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        projectId: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.projectId) await projectAccessGuard(ctx, input.projectId);
      const timerTemplate = await ctx.db.query.timerTemplates.findFirst({
        where: and(
          eq(timerTemplates.id, input.id),
          eq(timerTemplates.createdBy, ctx.auth.userId)
        ),
      });
      if (!timerTemplate)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timer template not found",
        });
      const updatedTimerTemplate = await ctx.db
        .update(timerTemplates)
        .set(input)
        .where(eq(timerTemplates.id, input.id))
        .returning();
      return updatedTimerTemplate;
    }),
});
