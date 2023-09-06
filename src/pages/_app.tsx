import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { type AppType } from "next/app";
import Head from "next/head";
import Navbar from "~/components/navbar";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Ikigai</title>
        <meta
          name="description"
          content="Managing tasks, projects, and notes shouldn't cost..."
        />
        <meta name="theme-color" content="#eab308" />
        <meta
          name="theme-color"
          content="#ca8a04"
          media="(prefers-color-scheme: dark)"
        />
        <meta property="og:image" content="/og_image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:title"
          content="Ikigai - Task Management & more..."
        />
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icons/apple_touch_180x180.png" />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="180x180"
          href="/icons/apple_touch_180x180.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="167x167"
          href="/icons/apple_touch_167x167.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="152x152"
          href="/icons/apple_touch_152x152.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="120x120"
          href="/icons/apple_touch_120x120.png"
        />
      </Head>
      <ClerkProvider
        appearance={{
          elements: {
            formFieldInput: "rounded-lg",
          },
        }}
        {...pageProps}
      >
        <Navbar />
        <Component {...pageProps} />
      </ClerkProvider>
      <Analytics />
    </>
  );
};

export default api.withTRPC(MyApp);
