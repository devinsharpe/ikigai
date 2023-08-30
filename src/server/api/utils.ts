import type { SignedInAuthObject } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "drizzle-orm";
import type { DbClient } from "../db";
import { projects } from "../db/schema";

export async function projectAccessGuard(
  ctx: {
    auth: SignedInAuthObject;
    db: DbClient;
  },
  id: string
) {
  const project = await ctx.db.query.projects.findFirst({
    where: and(
      eq(projects.id, id),
      eq(projects.isActive, true),
      ...(ctx.auth.orgId
        ? [
            eq(projects.organization, ctx.auth.orgId),
            eq(projects.isActive, true),
          ]
        : [
            eq(projects.createdBy, ctx.auth.userId),
            isNull(projects.organization),
          ])
    ),
  });
  if (!project)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Missing access to project",
    });
}
