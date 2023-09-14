import CurrentTimerDropdown, {
  type CurrentTimerDropdownProps,
} from "./items/currentTimerDropdown";
import { Search, LayoutDashboard } from "lucide-react";

interface SearchNavProps {
  currentTimerControls: CurrentTimerDropdownProps;
}

function SearchNav({ currentTimerControls }: SearchNavProps) {
  return (
    <form className="sticky top-16 z-[1] w-full bg-white/75 p-2 backdrop-blur-lg">
      <div className="container mx-auto flex gap-2">
        <CurrentTimerDropdown {...currentTimerControls} />
        <div className="relative w-full">
          <input
            type="text"
            className="w-full rounded-lg border border-zinc-300 bg-white p-3 pl-10 text-zinc-800"
            placeholder="Search Projects, Tasks, Notes, etc."
          />
          <span className="absolute bottom-0 left-2 top-0 flex h-full items-center justify-center pl-2">
            <Search className="h-4 w-4" />
          </span>
        </div>
        <button
          type="button"
          className="flex w-16 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100"
          onClick={console.log}
        >
          <LayoutDashboard />
          <span className="sr-only">Edit Dashboard</span>
        </button>
      </div>
    </form>
  );
}

export default SearchNav;
