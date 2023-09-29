import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createApi, type ColorId } from "unsplash-js";
import type { Random } from "unsplash-js/dist/methods/photos/types";
import z from "zod";
import { env } from "~/env.mjs";
import { images } from "~/server/db/schema";
import {
  ProjectThemeOptions,
  ProjectThemeValues,
} from "~/server/db/schema/enums";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const unsplash = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
});

const themeColorIdMap: Record<ProjectThemeOptions, ColorId> = {
  [ProjectThemeOptions.Zinc]: "black_and_white",
  [ProjectThemeOptions.Amber]: "yellow",
  [ProjectThemeOptions.Blue]: "blue",
  [ProjectThemeOptions.Cyan]: "blue",
  [ProjectThemeOptions.Emerald]: "green",
  [ProjectThemeOptions.Lime]: "green",
  [ProjectThemeOptions.Orange]: "orange",
  [ProjectThemeOptions.Pink]: "red",
  [ProjectThemeOptions.Red]: "red",
  [ProjectThemeOptions.Violet]: "purple",
};

export const unsplashRouter = createTRPCRouter({
  download: protectedProcedure
    .input(
      z.object({
        location: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await unsplash.photos.trackDownload({
        downloadLocation: input.location,
      });
      return null;
    }),
  list: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().default(1),
        perPage: z.number().default(10),
        color: z.enum(ProjectThemeValues).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const photos = await unsplash.search.getPhotos({
        ...input,
        color: input.color ? themeColorIdMap[input.color] : undefined,
        orientation: "landscape",
      });
      return photos.response;
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const photo = await unsplash.photos.get({
        photoId: input.id,
      });
      return photo;
    }),
  random: protectedProcedure.mutation(async () => {
    const randomPhoto = await unsplash.photos.getRandom({});
    return randomPhoto.response as Random;
  }),
  save: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const photo = await unsplash.photos.get({
        photoId: input.id,
      });
      if (photo.response) {
        const oldImage = await ctx.db.query.images.findFirst({
          where: eq(images.id, photo.response.id),
        });
        if (oldImage) return [oldImage];
        const image = await ctx.db
          .insert(images)
          .values({
            id: photo.response.id,
            username: photo.response.user.username ?? "",
            userFullName: photo.response.user.name ?? "",
            userUrl: photo.response.user.portfolio_url ?? "",
            description: photo.response.description ?? "",
            downloadUrl: photo.response.links.download_location,
            htmlUrl: photo.response.urls.regular,
          })
          .returning();
        return image;
      }
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Unsplash Image not found",
      });
    }),
});
