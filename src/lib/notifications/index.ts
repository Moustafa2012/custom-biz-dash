// ============================================================================
// Notifications + Mail + Telegram + Audit — single shared service
// Frontend-only: persists to localStorage. Designed to be swapped for a real
// backend later without changing call sites.
// ============================================================================

export type AppId = "platform" | "site-manager" | "synex"
export type Channel = "inapp" | "email" | "telegram"
export type Severity = "info" | "success" | "warning" | "error"
export type DeliveryStatus = "queued" | "sent" | "failed" | "skipped"

export interface NotificationEvent {
  id: string
  createdAt: number
  app: AppId
  channel: Channel
  severity: Severity
  title: string
  body: string
  recipient?: string // email or chat id
  status: DeliveryStatus
  error?: string
  read?: boolean // for inapp inbox
  meta?: Record<string, unknown>
}

export interface MailerConfig {
  enabled: boolean
  host: string
  port: string
  username: string
  fromEmail: string
  fromName: string
}

export interface TelegramConfig {
  enabled: boolean
  botToken: string
  defaultChatId: string
}

export interface InboxStats {
  total: number
  unread: number
  byApp: Record<AppId, number>
  byChannel: Record<Channel, number>
  failed: number
  last24h: number
}

// ---------- storage keys ----------
const K_EVENTS = "notif:events"
const K_MAILER = "notif:mailer"
const K_TELEGRAM = "notif:telegram"
const MAX_EVENTS = 1000

const DEFAULT_MAILER: MailerConfig = {
  enabled: false,
  host: "",
  port: "587",
  username: "",
  fromEmail: "",
  fromName: "",
}
const DEFAULT_TELEGRAM: TelegramConfig = {
  enabled: false,
  botToken: "",
  defaultChatId: "",
}

// ---------- low-level storage ----------
function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota */
  }
}

// ---------- pub/sub ----------
type Listener = () => void
const listeners = new Set<Listener>()
function emit() {
  listeners.forEach((fn) => {
    try { fn() } catch { /* noop */ }
  })
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("notif:changed"))
  }
}
export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  const onStorage = (e: StorageEvent) => {
    if (e.key === K_EVENTS || e.key === K_MAILER || e.key === K_TELEGRAM) fn()
  }
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(fn)
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage)
  }
}

// ---------- config ----------
export function getMailerConfig(): MailerConfig {
  return { ...DEFAULT_MAILER, ...readJSON<MailerConfig>(K_MAILER, DEFAULT_MAILER) }
}
export function setMailerConfig(cfg: MailerConfig) {
  writeJSON(K_MAILER, cfg)
  emit()
}
export function getTelegramConfig(): TelegramConfig {
  return { ...DEFAULT_TELEGRAM, ...readJSON<TelegramConfig>(K_TELEGRAM, DEFAULT_TELEGRAM) }
}
export function setTelegramConfig(cfg: TelegramConfig) {
  writeJSON(K_TELEGRAM, cfg)
  emit()
}

// ---------- events ----------
export function getEvents(): NotificationEvent[] {
  const list = readJSON<NotificationEvent[]>(K_EVENTS, [])
  return Array.isArray(list) ? list : []
}
function saveEvents(events: NotificationEvent[]) {
  const trimmed = events.slice(0, MAX_EVENTS)
  writeJSON(K_EVENTS, trimmed)
  emit()
}
function pushEvent(ev: NotificationEvent) {
  const next = [ev, ...getEvents()]
  saveEvents(next)
}
export function markRead(id: string) {
  saveEvents(getEvents().map((e) => (e.id === id ? { ...e, read: true } : e)))
}
export function markAllRead(app?: AppId) {
  saveEvents(getEvents().map((e) => (!app || e.app === app ? { ...e, read: true } : e)))
}
export function clearEvents(app?: AppId) {
  saveEvents(app ? getEvents().filter((e) => e.app !== app) : [])
}

// ---------- helpers ----------
function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

// ---------- sending ----------
export interface SendInput {
  app: AppId
  title: string
  body: string
  severity?: Severity
  channels?: Channel[]
  recipientEmail?: string
  recipientChatId?: string
  meta?: Record<string, unknown>
}

/**
 * Frontend-only send: validates config, records event with status. Without a
 * backend we cannot actually transmit email/telegram — events are queued and
 * marked `sent` only when the relevant channel is enabled and configured.
 */
export async function send(input: SendInput): Promise<NotificationEvent[]> {
  const channels = input.channels ?? ["inapp"]
  const created: NotificationEvent[] = []
  const mailer = getMailerConfig()
  const tg = getTelegramConfig()

  for (const channel of channels) {
    let status: DeliveryStatus = "queued"
    let error: string | undefined
    let recipient: string | undefined

    if (channel === "inapp") {
      status = "sent"
    } else if (channel === "email") {
      recipient = input.recipientEmail || mailer.fromEmail
      if (!mailer.enabled) { status = "skipped"; error = "Mailer disabled" }
      else if (!mailer.host || !mailer.fromEmail) { status = "failed"; error = "Mailer not configured" }
      else if (!recipient) { status = "failed"; error = "No recipient" }
      else { status = "sent" }
    } else if (channel === "telegram") {
      recipient = input.recipientChatId || tg.defaultChatId
      if (!tg.enabled) { status = "skipped"; error = "Telegram disabled" }
      else if (!tg.botToken || !recipient) { status = "failed"; error = "Telegram not configured" }
      else { status = "sent" }
    }

    const ev: NotificationEvent = {
      id: uid(),
      createdAt: Date.now(),
      app: input.app,
      channel,
      severity: input.severity ?? "info",
      title: input.title,
      body: input.body,
      recipient,
      status,
      error,
      read: false,
      meta: input.meta,
    }
    created.push(ev)
  }

  // single write for all channels
  saveEvents([...created, ...getEvents()])
  return created
}

// ---------- stats ----------
export function getStats(): InboxStats {
  const events = getEvents()
  const since = Date.now() - 24 * 60 * 60 * 1000
  const byApp = { platform: 0, "site-manager": 0, synex: 0 } as Record<AppId, number>
  const byChannel = { inapp: 0, email: 0, telegram: 0 } as Record<Channel, number>
  let unread = 0
  let failed = 0
  let last24h = 0
  for (const e of events) {
    byApp[e.app] = (byApp[e.app] ?? 0) + 1
    byChannel[e.channel] = (byChannel[e.channel] ?? 0) + 1
    if (!e.read && e.channel === "inapp") unread++
    if (e.status === "failed") failed++
    if (e.createdAt >= since) last24h++
  }
  return { total: events.length, unread, byApp, byChannel, failed, last24h }
}
