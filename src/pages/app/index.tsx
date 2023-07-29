import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Home, LayoutDashboard, Plus, Search } from "lucide-react";
import { useState } from "react";
import Collapsible, { CollapsibleActionButton, CollapsibleItem } from "~/components/collapsible";

function AppHomePage() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const organization = useOrganization();
  const organizationList = useOrganizationList();
  console.log(organization)
  console.log(organizationList)

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
          <Collapsible
            isOpen={isProjectsOpen}
            onOpenChange={() => setIsProjectsOpen(!isProjectsOpen)}
            previewCount={2}
            actions={[
              <CollapsibleActionButton title="New Project" key="project-new" onClick={() => console.log("hello world")}>
                <>
                  <Plus />
                  <span className="sr-only">New Project</span>
                </>
              </CollapsibleActionButton>
            ]}
            elements={[
              (
                <CollapsibleItem key="0">
                  <>
                    <span>🎯</span>
                    <span className="font-semibold">DevSharpe</span>
                    <span className="bg-zinc-200 rounded-lg ml-auto px-3 py-1 text-sm">7</span>
                  </>
                </CollapsibleItem>
              ),
              (<CollapsibleItem key="1">
                <>
                  <span>📒</span>
                  <span className="font-semibold">Day Job</span>
                  <span className="bg-zinc-200 rounded-lg ml-auto px-3 py-1 text-sm">11</span>
                </>
              </CollapsibleItem>),
              (<CollapsibleItem key="2">
                <>
                  <span>❄️</span>
                  <span className="font-semibold">Personal</span>
                  <span className="bg-zinc-200 rounded-lg ml-auto px-3 py-1 text-sm">3</span>
                </>
              </CollapsibleItem >)
            ]}
            title="Projects"
          />
        </div >
      </main >
    </>
  )
}

export default AppHomePage;
