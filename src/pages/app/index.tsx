import { ChevronDown, Home, LayoutDashboard, Plus, Search } from "lucide-react";

function AppHomePage() {
  return (
    <>
      <form className="w-full sticky top-16 p-2 bg-white">
        <div className="mx-auto container flex gap-2">
          <button type="button" className="w-16 rounded-lg flex items-center border-zinc-300 justify-center border hover:bg-zinc-100">
            <Home />
          </button>
          <div className="w-full relative">
            <input type="text" className="rounded-lg p-3 w-full pl-10 text-zinc-800 bg-white border border-zinc-300" placeholder="Search Projects, Tasks, Notes, etc." />
            <span className="absolute left-2 top-0 bottom-0 pl-2 flex items-center justify-center h-full">
              <Search className="h-4 w-4" />
            </span>
          </div>
          <button type="button" className="w-16 rounded-lg flex items-center border-zinc-300 justify-center border hover:bg-zinc-100" onClick={console.log}>
            <LayoutDashboard />
            <span className="sr-only">Edit Dashboard</span>
          </button>
        </div>
      </form>
      <main className="container mx-auto flex flex-col gap-4 min-h-screen flex-col pt-20 px-2">
        <div className="flex flex-col gap-2">
          <div className="font-bold tracking-wide text-2xl text-zinc-800 flex items-center justify-between gap-2 px-2">
            <h3>Projects</h3>
            <div className="flex items-center gap-4">
              <Plus />
              <ChevronDown />
            </div>
          </div>
          <ul className="rounded-lg border divide-y bg-zinc-50">
            <li className="py-2 px-4 flex items-center gap-2">
              <span>🎯</span>
              <span className="font-semibold">DevSharpe</span>
              <span className="bg-zinc-200 rounded-lg ml-auto px-3 py-1 text-sm">7</span>
            </li>
            <li className="py-2 px-4 flex items-center gap-2">
              <span>📒</span>
              <span className="font-semibold">Day Job</span>
              <span className="bg-zinc-200 rounded-lg ml-auto px-3 py-1 text-sm">11</span>
            </li>
            <li className="py-2 px-4 flex items-center gap-2">
              <span>❄️</span>
              <span className="font-semibold">Personal</span>
              <span className="bg-zinc-200 rounded-lg ml-auto px-3 py-1 text-sm">3</span>
            </li>
          </ul>
        </div>
      </main>
    </>
  )
}

export default AppHomePage;
