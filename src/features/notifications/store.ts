import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationLevel = "info" | "success" | "warning" | "error";

export interface AppNotification {
  id: string;
  level: NotificationLevel;
  titleEn: string;
  titleAr: string;
  bodyEn?: string;
  bodyAr?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  items: AppNotification[];
  push: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: [],
      push: (n) =>
        set({
          items: [
            {
              ...n,
              id: crypto.randomUUID(),
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...get().items,
          ].slice(0, 100),
        }),
      markRead: (id) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, read: true } : i)),
        }),
      markAllRead: () =>
        set({ items: get().items.map((i) => ({ ...i, read: true })) }),
      clear: () => set({ items: [] }),
    }),
    { name: "notifications-storage" }
  )
);
