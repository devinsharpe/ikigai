import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";
import Navbar from "~/components/navbar";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Ikigai</title>
        <meta
          name="description"
          content="Managing tasks, projects, and notes shouldn't cost..."
        />
        <link rel="icon" href="https://www.devsharpe.io/api/favicon?emoji=📒" />
      </Head>
      <ClerkProvider {...pageProps}>
        <Navbar />
        <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
