import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import {
  subscribe,
  getEvents,
  getStats,
  getMailerConfig,
  getTelegramConfig,
  setMailerConfig,
  setTelegramConfig,
  markRead,
  markAllRead,
  clearEvents,
  send,
  type AppId,
  type SendInput,
  type NotificationEvent,
  type MailerConfig,
  type TelegramConfig,
} from "./index"

function useStoreSlice<T>(read: () => T): T {
  const [state, setState] = useState<T>(read)
  useEffect(() => subscribe(() => setState(read())), [read])
  return state
}

export function useNotifications(app?: AppId) {
  const events = useStoreSlice(useCallback(() => getEvents(), []))
  const filtered = app ? events.filter((e) => e.app === app) : events
  const inbox = filtered.filter((e) => e.channel === "inapp")
  const unread = inbox.filter((e) => !e.read).length
  return {
    events: filtered,
    inbox,
    unread,
    markRead,
    markAllRead: () => markAllRead(app),
    clear: () => clearEvents(app),
  }
}

export function useNotificationStats() {
  return useStoreSlice(useCallback(() => getStats(), []))
}

export function useMailerConfig(): [MailerConfig, (c: MailerConfig) => void] {
  const cfg = useStoreSlice(useCallback(() => getMailerConfig(), []))
  return [cfg, setMailerConfig]
}

export function useTelegramConfig(): [TelegramConfig, (c: TelegramConfig) => void] {
  const cfg = useStoreSlice(useCallback(() => getTelegramConfig(), []))
  return [cfg, setTelegramConfig]
}

/**
 * Send a notification AND surface in-app sends via a toast so the user sees
 * it immediately, regardless of which app called.
 */
export function useNotify() {
  return useCallback(async (input: SendInput): Promise<NotificationEvent[]> => {
    const created = await send(input)
    for (const ev of created) {
      if (ev.channel !== "inapp") continue
      const fn = ev.severity === "error" ? toast.error
        : ev.severity === "success" ? toast.success
        : ev.severity === "warning" ? toast.warning
        : toast.info
      fn(ev.title, { description: ev.body })
    }
    return created
  }, [])
}
