import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import ThemeProvider from "~/components/providers/theme";
import Navbar from "~/components/ui/navbar";
import React from "react";
import type { NextComponentType, NextPageContext } from "next";

const Main: React.FC<{
  Component: NextComponentType<NextPageContext, unknown, unknown>;
  pageProps: Record<string, unknown>;
}> = ({ Component, pageProps }) => {
  const session = useSession();
  console.log(session);
  return (
    <>
      <Component {...pageProps} />
      {session.status === "authenticated" ? (
        <Navbar session={session as unknown as Session} />
      ) : (
        <></>
      )}
      <footer className="flex items-center justify-center pb-24">
        <p className="text-sm text-card-foreground/50">
          made with ❤️ by&nbsp;
          <a href="https://devsharpe.io/" target="_blank" className="underline">
            devsharpe
          </a>
        </p>
      </footer>
    </>
  );
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <Main Component={Component} pageProps={pageProps} />
      </SessionProvider>
      <ThemeProvider />
    </>
  );
};

export default api.withTRPC(MyApp);
