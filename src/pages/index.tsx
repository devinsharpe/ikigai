import { SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Ikigai</title>
        <meta
          name="description"
          content="Managing tasks, projects, and notes shouldn't cost..."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="fixed inset-x-0 top-0 flex w-full justify-center">
        <div className="container flex w-full justify-between py-2">
          <h1 className="flex items-center gap-2 text-lg font-bold tracking-wide text-zinc-800">
            <span>&#10048;</span>
            <span>Ikigai</span>
          </h1>
          <UserButton />
          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-lg border bg-zinc-200 px-4 py-1 font-semibold text-zinc-800 hover:bg-zinc-300"
            >
              Sign In
            </Link>
          </SignedOut>
        </div>
      </nav>
      <main className="container mx-auto flex min-h-screen flex-col items-center pt-12">
        <h1>Hello world</h1>
      </main>
    </>
  );
}
