// ============================================================================
// 2FA service — Email OTP + Telegram OTP. Frontend-only, time-limited codes
// stored in sessionStorage so they vanish on tab close.
// ============================================================================
import { send, type AppId, type Channel } from "@/lib/notifications"

const K_CHALLENGE = "twofa:challenge"
const TTL_MS = 5 * 60 * 1000
const RESEND_COOLDOWN_MS = 30 * 1000

export type TwoFAChannel = Extract<Channel, "email" | "telegram">

export interface TwoFAChallenge {
  id: string
  app: AppId
  channel: TwoFAChannel
  codeHash: string
  recipient: string
  createdAt: number
  expiresAt: number
  attempts: number
  purpose: string
}

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

function genCode(): string {
  // 6-digit numeric, leading-zero safe
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000
  return String(n).padStart(6, "0")
}

function readChallenge(): TwoFAChallenge | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(K_CHALLENGE)
    return raw ? (JSON.parse(raw) as TwoFAChallenge) : null
  } catch { return null }
}
function writeChallenge(c: TwoFAChallenge | null) {
  if (typeof window === "undefined") return
  if (!c) sessionStorage.removeItem(K_CHALLENGE)
  else sessionStorage.setItem(K_CHALLENGE, JSON.stringify(c))
}

export function getActiveChallenge(): TwoFAChallenge | null {
  const c = readChallenge()
  if (!c) return null
  if (Date.now() > c.expiresAt) { writeChallenge(null); return null }
  return c
}

export function canResend(): boolean {
  const c = readChallenge()
  if (!c) return true
  return Date.now() - c.createdAt >= RESEND_COOLDOWN_MS
}

export interface StartInput {
  app: AppId
  channel: TwoFAChannel
  recipient: string
  purpose?: string
}

export async function startChallenge(input: StartInput): Promise<TwoFAChallenge> {
  const code = genCode()
  const codeHash = await sha256(code)
  const now = Date.now()
  const challenge: TwoFAChallenge = {
    id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    app: input.app,
    channel: input.channel,
    codeHash,
    recipient: input.recipient,
    createdAt: now,
    expiresAt: now + TTL_MS,
    attempts: 0,
    purpose: input.purpose ?? "verify",
  }
  writeChallenge(challenge)

  // Dispatch the code via configured channel. The notification event records
  // status (sent/failed/skipped) for the audit log. The plaintext code itself
  // is never stored — only the hash.
  await send({
    app: input.app,
    title: "2FA verification code",
    body: `Your verification code is ${code}. It expires in 5 minutes.`,
    severity: "info",
    channels: [input.channel],
    recipientEmail: input.channel === "email" ? input.recipient : undefined,
    recipientChatId: input.channel === "telegram" ? input.recipient : undefined,
    meta: { kind: "2fa", purpose: challenge.purpose, challengeId: challenge.id },
  })

  return challenge
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "no_challenge" | "expired" | "too_many_attempts" | "mismatch" }

export async function verifyCode(code: string): Promise<VerifyResult> {
  const c = readChallenge()
  if (!c) return { ok: false, reason: "no_challenge" }
  if (Date.now() > c.expiresAt) { writeChallenge(null); return { ok: false, reason: "expired" } }
  if (c.attempts >= 5) { writeChallenge(null); return { ok: false, reason: "too_many_attempts" } }
  const hash = await sha256(code.trim())
  if (hash !== c.codeHash) {
    writeChallenge({ ...c, attempts: c.attempts + 1 })
    return { ok: false, reason: "mismatch" }
  }
  writeChallenge(null)
  return { ok: true }
}

export function cancelChallenge() {
  writeChallenge(null)
}
