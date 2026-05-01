import { create } from "zustand";
import { persist } from "zustand/middleware";

// Per-user UI preferences not covered by AppConfig (which already handles
// language, theme, accent, etc.). Anything cross-feature and lightweight
// can live here.

interface PreferencesState {
  pageSize: number;
  showHelpHints: boolean;
  setPageSize: (n: number) => void;
  setShowHelpHints: (v: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      pageSize: 20,
      showHelpHints: true,
      setPageSize: (pageSize) => set({ pageSize }),
      setShowHelpHints: (showHelpHints) => set({ showHelpHints }),
    }),
    { name: "preferences-storage" }
  )
);
