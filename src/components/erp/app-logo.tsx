import { useAppConfig } from "./app-config";

export function AppLogo() {
  const { currentApp } = useAppConfig();
  return (
    <span className="text-xs font-semibold text-muted-foreground">
      {currentApp.name}
    </span>
  );
}
