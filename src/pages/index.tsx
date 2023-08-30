import { SignedIn, SignedOut } from "@clerk/nextjs";

import { PlayCircle, Smartphone } from "lucide-react";
import Link from "next/link";
import AppIcon from "~/components/appIcon";

export default function Home() {
  return (
    <>
      <main className="container mx-auto flex min-h-screen flex-col gap-32 px-4 py-24">
        <section className="group mx-auto flex w-full max-w-4xl flex-col items-center gap-4 rounded-xl bg-zinc-100 px-4 py-8 animate-in fade-in duration-500 ease-out md:gap-8 md:py-12">
          <h2
            title="Ikigai"
            className=" text-center text-4xl font-bold tracking-wide md:text-6xl"
          >
            <span className="group-hover:hidden">生き甲斐</span>
            <span className="hidden group-hover:block">Ikigai</span>
          </h2>
          <div className="flex flex-col items-center gap-2">
            <p className="text-semibold mx-auto max-w-lg text-center italic text-zinc-600">
              a motivating force; something or someone that gives a person a
              sense of purpose or a reason for living
            </p>
            <a
              href="https://www.oed.com/dictionary/ikigai_n"
              className="text-xs text-zinc-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              Oxford Dictionary
            </a>
          </div>
          <SignedIn>
            <Link
              href="/app"
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-white animate-in fade-in duration-500 hover:bg-zinc-900"
            >
              <Smartphone />
              <span>Go to App</span>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-up"
              className="flex items-center justify-center gap-2 rounded-lg bg-zinc-800 px-6 py-3 text-white animate-in fade-in duration-500 hover:bg-zinc-900"
            >
              <PlayCircle />
              <span>Get Started</span>
            </Link>
          </SignedOut>
        </section>

        <section className="mx-auto flex w-full max-w-4xl flex-col items-center gap-16">
          <div>
            <div className="mb-1 flex items-center gap-2 text-indigo-500">
              <AppIcon className="h-4 w-4 " />
              <p className="font-semibold">Intentionality @ its Core</p>
            </div>
            <h3 className="text-2xl font-bold tracking-wide md:text-4xl">
              The easiest way to track each productive and wasted hour
            </h3>
          </div>

          <div className="text-right">
            <div className="mb-1 flex w-full items-center justify-end gap-2 text-emerald-600">
              <p className="font-semibold">Project Based Living</p>
              <AppIcon className="h-4 w-4 " />
            </div>
            <h3 className="text-2xl font-bold tracking-wide md:text-4xl">
              Managing life&apos;s projects and every curveball in one app
            </h3>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2 text-rose-500">
              <AppIcon className="h-4 w-4 " />
              <p className="font-semibold">Take the pressure off</p>
            </div>
            <h3 className="text-2xl font-bold tracking-wide md:text-4xl">
              Get insights and recommendations from
              <span className="text-rose-500">&nbsp;Poppy</span>, an AI friend
            </h3>
            <p className="text-sm text-zinc-600">Coming soon</p>
          </div>

          <div className="w-full text-right">
            <div className="mb-1 flex w-full items-center justify-end gap-2 text-orange-600">
              <p className="font-semibold">Clear the air</p>
              <AppIcon className="h-4 w-4 " />
            </div>
            <h3 className="text-2xl font-bold tracking-wide md:text-4xl">
              Keep all of your thoughts in one place right next to the rest of
              your project details
            </h3>
            <p className="text-sm text-zinc-600">Coming soon</p>
          </div>
        </section>

        <section className="flex flex-col items-center gap-8">
          <div>
            <div className="mb-1 flex items-center justify-center gap-2 text-zinc-500">
              <AppIcon className="h-4 w-4 " />
              <p className="font-semibold">The Story</p>
              <AppIcon className="h-4 w-4 " />
            </div>
            <h3 className="text-2xl font-bold tracking-wide md:text-4xl">
              Living Life a Little Differently
            </h3>
          </div>
          <p className="mx-auto w-full max-w-2xl">
            Discovering one&apos;s ikigai, or purpose in life, is a journey that
            requires self-reflection and introspection. It&apos;s about finding
            the perfect balance between work, personal relationships, and
            activities that bring you joy and fulfillment. But what happens when
            life gets busy and overwhelming? How do you maintain that delicate
            balance without feeling stressed or overwhelmed?
          </p>
          <p className="mx-auto w-full max-w-2xl">
            That&apos;s where Ikigai comes in - a progressive web application
            (PWA) designed to help you manage your life in a peaceful way.
            Conceived after the creator reevaluated their own life and tried to
            organize things without being overly critical, Ikigai is built to
            help you streamline your events, tasks, notes, and working hours
            into one easy-to-use platform.
          </p>
        </section>

        <footer className="flex items-center justify-center">
          <a
            href="https://www.devsharpe.io"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-zinc-100 px-8 py-4 text-zinc-700"
          >
            Made with ❤️ by Devin Sharpe
          </a>
        </footer>
      </main>
    </>
  );
}
