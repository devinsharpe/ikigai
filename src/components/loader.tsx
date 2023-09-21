import { Loader2 } from "lucide-react";
import { cn } from "~/lib/cn";

interface LoaderProps {
  className?: string;
  children?: JSX.Element | null;
  isLoading: boolean;
}

function Loader({ className, children = null, isLoading }: LoaderProps) {
  if (isLoading) return <Loader2 className={cn("animate-spin", className)} />;
  return children;
}

export default Loader;
