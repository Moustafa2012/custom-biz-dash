import { useState } from "react";
import { ChevronsUpDown, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AppLogoIcon } from "./app-logo-icon";
import { useAppConfig, erpApps, type ErpApp } from "./app-config";
import { useSidebar } from "@/components/ui/sidebar";

export function AppSwitcher() {
  const { currentApp, setCurrentApp, getAppName, t } = useAppConfig();
  const { state } = useSidebar();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const isCollapsed = state === "collapsed";

  const filtered = erpApps.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.description?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (app: ErpApp) => {
    setCurrentApp(app);
    setOpen(false);
    setQuery("");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "group w-full justify-center gap-2.5 px-2 py-2 h-auto",
            "rounded-xl transition-all duration-200",
            "hover:bg-accent/10 data-[state=open]:bg-accent/10",
            isCollapsed && "w-12 h-12 p-0 justify-center items-center gap-0"
          )}
        >
          <AppLogoIcon />
          {!isCollapsed && (
            <>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="text-sm font-semibold truncate leading-tight">{getAppName(currentApp.id)}</span>
                {currentApp.description && (
                  <span className="text-[10px] text-muted-foreground truncate leading-tight">
                    {currentApp.description}
                  </span>
                )}
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={isCollapsed ? "center" : "start"}
        className="w-64 p-2 rounded-xl shadow-xl border border-border/60 backdrop-blur-sm"
        sideOffset={4}
      >
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("البحث عن التطبيقات...", "Search apps...")}
            className="h-8 pl-8 text-sm rounded-lg border-border/60 bg-muted/40"
            autoFocus
          />
        </div>

        <DropdownMenuSeparator className="my-1.5 -mx-2" />

        <div className="space-y-0.5">
          {filtered.length === 0 ? (
            <p className="py-3 text-center text-xs text-muted-foreground">{t("لم يتم العثور على تطبيقات", "No apps found")}</p>
          ) : (
            filtered.map((app) => (
              <DropdownMenuItem
                key={app.id}
                onClick={() => handleSelect(app)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-2.5 py-2 cursor-pointer transition-colors duration-150",
                  currentApp.id === app.id && "bg-accent/10"
                )}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: app.color,
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate leading-tight">{getAppName(app.id)}</p>
                  {app.description && (
                    <p className="text-[10px] text-muted-foreground truncate leading-tight">{app.description}</p>
                  )}
                </div>
                {currentApp.id === app.id && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
