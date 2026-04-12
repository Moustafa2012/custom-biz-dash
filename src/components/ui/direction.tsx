import { createContext, useContext } from "react";
import type { ReactNode } from "react";

const DirectionContext = createContext<"ltr" | "rtl">("ltr");

export function DirectionProvider({ dir, children }: { dir: "ltr" | "rtl"; children: ReactNode }) {
  return (
    <DirectionContext.Provider value={dir}>
      <div dir={dir}>{children}</div>
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  return useContext(DirectionContext);
}
