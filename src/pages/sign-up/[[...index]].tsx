import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <Link href="/">
        <h1 className="flex items-center gap-2 text-left text-3xl font-bold tracking-wide text-zinc-800">
          <Image
            src="/icons/icon.svg"
            alt="Ikigai logo"
            height="40"
            width="40"
            className="h-10 w-10"
          />
          <span className="sr-only">Ikigai</span>
        </h1>
      </Link>
      <SignUp
        appearance={{
          elements: {
            card: "shadow-none bg-transparent",
          },
        }}
      />
    </div>
  );
}
