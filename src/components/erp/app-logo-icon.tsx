import { useAppConfig } from "./app-config";

export function AppLogoIcon() {
  const { currentApp } = useAppConfig();
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold shrink-0"
      style={{ backgroundColor: currentApp.color, color: "white" }}
    >
      {currentApp.icon}
    </div>
  );
}
