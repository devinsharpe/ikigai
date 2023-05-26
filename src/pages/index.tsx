import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Inter } from "@next/font/google";

import { api } from "~/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@sh/card";
import { CardTitle } from "@sh/card";
import { ArrowRight, LogIn, LogOut } from "lucide-react";
import { Separator } from "@sh/separator";
import { Button } from "@sh/button";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const session = useSession();

  return (
    <>
      <Head>
        <title>Ikigai - Helping my ADHD brain find purpose</title>
        <meta
          name="description"
          content="This is my project that shouldn't have started all to satisfy and hopefully help my ADHD brain"
        />
        <link rel="icon" href="https://devsharpe.io/api/favicon?emoji=☀️" />
      </Head>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
          }
        `}
      </style>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle>Create T3 App</CardTitle>
              <CardDescription>
                Web Application Development Done Differently
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link
                className="space-y-1 rounded-md p-2 hover:bg-accent"
                href="https://create.t3.gg/en/usage/first-steps"
                target="_blank"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">First Steps</h2>
                  <ArrowRight />
                </div>
                <p>
                  Just the basics &ndash; Everything you need to know to set up
                  your database and authentication.
                </p>
              </Link>
              <Separator />
              <Link
                className="space-y-1 rounded-md p-2 hover:bg-accent"
                href="https://create.t3.gg/en/introduction"
                target="_blank"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Documentation</h2>
                  <ArrowRight />
                </div>
                <p>
                  Learn more about Create T3 App, the libraries it uses, and how
                  to deploy it.
                </p>
              </Link>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-between">
                <p>
                  {hello.data ? hello.data.greeting : "Loading tRPC query..."}
                </p>
                <Button
                  icon={
                    session.status === "authenticated" ? (
                      <LogOut className="mr-2 h-4 w-4" />
                    ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                    )
                  }
                  variant="secondary"
                  onClick={() => {
                    if (session.status === "authenticated") void signOut();
                    else void signIn("apple");
                  }}
                >
                  {session.status === "authenticated" ? "Sign Out" : "Sign In"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Home;
