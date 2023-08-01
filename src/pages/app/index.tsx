import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Home, LayoutDashboard, ListPlus, Plus, Search } from "lucide-react";
import { useState } from "react";
import Collapsible, {
  CollapsibleActionButton,
  CollapsibleItem,
} from "~/components/collapsible";
import Modal from "~/components/modal";

function AppHomePage() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const organization = useOrganization();
  const organizationList = useOrganizationList();
  console.log(organization);
  console.log(organizationList);

  return (
    <>
      <form className="sticky top-16 w-full bg-white p-2">
        <div className="container mx-auto flex gap-2">
          <button
            type="button"
            className="flex w-16 items-center justify-center rounded-lg border border-zinc-300 hover:bg-zinc-100"
          >
            <Home />
          </button>
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
      <main className="container mx-auto flex min-h-screen flex-col flex-col gap-4 px-2 pt-20">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Collapsible
            isOpen={isProjectsOpen}
            onOpenChange={() => setIsProjectsOpen(!isProjectsOpen)}
            previewCount={2}
            actions={[
              <CollapsibleActionButton
                title="New Project"
                key="project-new"
                onClick={() => setIsNewProjectOpen(true)}
              >
                <>
                  <Plus />
                  <span className="sr-only">New Project</span>
                </>
              </CollapsibleActionButton>,
            ]}
            elements={[
              <CollapsibleItem key="0">
                <>
                  <span>🎯</span>
                  <span className="font-semibold">DevSharpe</span>
                  <span className="ml-auto rounded-lg bg-zinc-200 px-3 py-1 text-sm">
                    7
                  </span>
                </>
              </CollapsibleItem>,
              <CollapsibleItem key="1">
                <>
                  <span>📒</span>
                  <span className="font-semibold">Day Job</span>
                  <span className="ml-auto rounded-lg bg-zinc-200 px-3 py-1 text-sm">
                    11
                  </span>
                </>
              </CollapsibleItem>,
              <CollapsibleItem key="2">
                <>
                  <span>❄️</span>
                  <span className="font-semibold">Personal</span>
                  <span className="ml-auto rounded-lg bg-zinc-200 px-3 py-1 text-sm">
                    3
                  </span>
                </>
              </CollapsibleItem>,
            ]}
            title="Projects"
          />
        </div>
      </main>
      <Modal
        isOpen={isNewProjectOpen}
        onOpenChange={() => setIsNewProjectOpen(!isNewProjectOpen)}
        title="New Project"
        description="Building a rocketship? Starting a new business? Renovating a home? Keeping up with your meds?"
      >
        <form className="flex flex-col gap-2">
          <input
            className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
            placeholder="Name your project"
            title="Project Name"
          />
          <textarea
            className="h-32 w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
            placeholder="Describe your project"
            title="Project Description"
          />
          <select
            title="Project Organization"
            className="w-full rounded-lg border border-zinc-300 p-3 text-zinc-800"
          >
            <option value="">Personal Workspace</option>
            {organizationList.organizationList ? (
              organizationList.organizationList.map((org) => (
                <option value={org.organization.id} key={org.organization.id}>
                  {org.organization.name}
                </option>
              ))
            ) : (
              <></>
            )}
          </select>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 p-3 text-white text-zinc-800 hover:bg-zinc-900">
            <ListPlus />
            <span>Create Project</span>
          </button>
        </form>
      </Modal>
    </>
  );
}

export default AppHomePage;
