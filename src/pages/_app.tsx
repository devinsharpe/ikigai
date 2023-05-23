import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import ThemeProvider from "~/components/providers/theme";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <footer className="flex items-center justify-center pb-24">
          <p className="text-sm text-card-foreground/50">
            made with ❤️ by{" "}
            <a
              href="https://devsharpe.io/"
              target="_blank"
              className="underline"
            >
              devsharpe
            </a>
          </p>
        </footer>
      </SessionProvider>
      <ThemeProvider />
    </>
  );
};

export default api.withTRPC(MyApp);
