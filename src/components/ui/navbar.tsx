import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarPlus,
  CheckCircle,
  Edit3,
  LogOut,
  PlusCircle,
  Timer,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@sh/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@sh/avatar";
import { type Session } from "next-auth";

import { Button } from "@sh/button";

interface NavbarProps {
  session: Session | null;
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  return (
    <nav className="fixed bottom-4 left-1/2 mx-auto flex -translate-x-1/2 transform items-center justify-center gap-2 rounded-md border bg-card px-4 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Start New...</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Timer className="mr-2 h-4 w-4" />
              <span>Timer</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CalendarPlus className="mr-2 h-4 w-4" />
              <span>Event</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Project</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit3 className="mr-2 h-4 w-4" />
              <span>Note</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" className="whitespace-nowrap">
        May 22
      </Button>
      <Button variant="ghost">
        <ArrowRight className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            {session && session.user ? (
              <AvatarImage
                src={
                  session.user.image ??
                  "https://source.unsplash.com/random/300×300/?cat"
                }
                alt={session.user.name ?? "User profile image"}
              />
            ) : (
              <AvatarImage
                src={"https://source.unsplash.com/random/300×300/?cat"}
                alt="User profile image"
              />
            )}
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Devin Sharpe</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default Navbar;
