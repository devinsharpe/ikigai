// import { createNextApiHandler } from "@trpc/server/adapters/next";
import { getAuth } from "@clerk/nextjs/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext() {
      const auth = getAuth(req);
      return createInnerTRPCContext({
        auth,
        req,
      });
    },
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });
}

export const config = {
  runtime: "edge",
};

// export API handler
// export default createNextApiHandler({
//   router: appRouter,
//   createContext: createTRPCContext,
// onError:
//   env.NODE_ENV === "development"
//     ? ({ path, error }) => {
//         console.error(
//           `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
//         );
//       }
//     : undefined,
// });
