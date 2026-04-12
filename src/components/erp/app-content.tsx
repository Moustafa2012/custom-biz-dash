import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAppConfig } from "./app-config";

export function AppContent({ children }: { children: ReactNode }) {
  const { contentDensity } = useAppConfig();

  const spacingMap = {
    compact: "p-3 gap-3",
    default: "p-5 gap-4",
    relaxed: "p-7 gap-6",
  };

  return (
    <main
      className={cn(
        "flex flex-1 flex-col bg-muted/20 min-h-0 overflow-y-auto",
        spacingMap[contentDensity]
      )}
    >
      {children}
    </main>
  );
}
