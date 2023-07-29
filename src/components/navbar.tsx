import { OrganizationSwitcher, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="fixed z-[1] p-2 inset-x-0 top-0 flex w-full justify-center bg-white">
      <div className="container flex w-full justify-between py-2">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-wide text-zinc-800">
          <span>&#10048;</span>
          <span>Ikigai</span>
        </h1>
        <div className="flex items-center gap-4">
          <OrganizationSwitcher
            appearance={{
              elements: {
                userPreviewAvatarBox: "hidden",
                userPreviewTextContainer: "h-8",
                rootBox: "h-8",
              },
            }}
          />
          <UserButton />
        </div>
        <SignedOut>
          <Link
            href="/sign-in"
            className="rounded-lg border bg-zinc-200 px-4 py-2 font-semibold text-zinc-800 hover:bg-zinc-300"
          >
            Sign In
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}

export default Navbar;
