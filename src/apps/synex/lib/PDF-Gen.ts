import jsPDF from 'jspdf'
import type { Transfer, Account, Beneficiary } from '../data/mock'
import { AMIRI_REGULAR_BASE64, AMIRI_BOLD_BASE64 } from './Amiri'

// ─── Font setup (inlined; previously in pdfUtils) ───────────────────────────
function setupFonts(doc: jsPDF, amiriRegularBase64: string, amiriBoldBase64: string) {
  doc.addFileToVFS('Amiri-Regular.ttf', amiriRegularBase64)
  doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal')
  doc.addFileToVFS('Amiri-Bold.ttf', amiriBoldBase64)
  doc.addFont('Amiri-Bold.ttf', 'Amiri', 'bold')
}


// ─────────────────────────────────────────────────────────────────────────────
// Minimal & modern transfer receipt
// Inspired by Stripe / Wise — generous whitespace, single accent, no ornaments.
// ─────────────────────────────────────────────────────────────────────────────

const W = 210
const H = 297
const M = 20 // page margin

// Palette
const INK = [17, 24, 39] as const          // near-black
const SUB = [107, 114, 128] as const       // muted gray
const LINE = [229, 231, 235] as const      // hairline
const ACCENT = [12, 35, 72] as const       // navy
const SOFT_BG = [249, 250, 251] as const   // very light gray
const SUCCESS = [16, 163, 74] as const
const WARN = [217, 119, 6] as const
const DANGER = [220, 38, 38] as const
const NEUTRAL = [107, 114, 128] as const

interface TransferPDFData {
  transfer: Transfer
  sourceAccount: Account
  beneficiary: Beneficiary
}

// Helpers
const fill = (d: jsPDF, c: readonly [number, number, number]) => d.setFillColor(c[0], c[1], c[2])
const stroke = (d: jsPDF, c: readonly [number, number, number]) => d.setDrawColor(c[0], c[1], c[2])
const text = (d: jsPDF, c: readonly [number, number, number]) => d.setTextColor(c[0], c[1], c[2])

function statusColor(s: string): readonly [number, number, number] {
  const k = s.toLowerCase()
  if (['completed', 'settled', 'approved', 'sent'].includes(k)) return SUCCESS
  if (['pending', 'pending_approval', 'processing'].includes(k)) return WARN
  if (['failed', 'rejected', 'cancelled', 'voided'].includes(k)) return DANGER
  return NEUTRAL
}

function formatDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatAmount(n: number): string {
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ─── Header ─────────────────────────────────────────────────────────────────
function drawHeader(doc: jsPDF, transfer: Transfer): number {
  // Brand mark
  fill(doc, ACCENT)
  doc.roundedRect(M, M, 8, 8, 1.5, 1.5, 'F')
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(7)
  text(doc, [255, 255, 255])
  doc.text('T', M + 4, M + 5.6, { align: 'center' })

  // Wordmark
  text(doc, INK)
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(11)
  doc.text('Thouraya Albilad', M + 12, M + 4)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7.5)
  text(doc, SUB)
  doc.text('Trading Co. · ثريا البلاد للتجارة', M + 12, M + 8.5)

  // Receipt label (right)
  text(doc, SUB)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7)
  doc.text('TRANSFER RECEIPT', W - M, M + 3, { align: 'right' })
  text(doc, INK)
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(10)
  doc.text(transfer.referenceNumber, W - M, M + 8.5, { align: 'right' })

  return M + 16
}

// ─── Hero amount block ──────────────────────────────────────────────────────
function drawHero(doc: jsPDF, y: number, transfer: Transfer): number {
  // Label
  text(doc, SUB)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(8)
  doc.text('Amount transferred', M, y + 4)

  // Big amount
  text(doc, INK)
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(34)
  const amount = formatAmount(Number(transfer.amount))
  doc.text(amount, M, y + 18)

  // Currency code next to amount
  const amountW = doc.getTextWidth(amount)
  doc.setFontSize(14)
  text(doc, SUB)
  doc.text(transfer.currency, M + amountW + 3, y + 18)

  // Status pill (right side, aligned with amount baseline)
  const sc = statusColor(transfer.status)
  const label = transfer.status.replace(/_/g, ' ').toUpperCase()
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(7)
  const pillW = doc.getTextWidth(label) + 10
  const pillH = 6
  const pillX = W - M - pillW
  const pillY = y + 12
  // pill bg (tinted)
  doc.setFillColor(sc[0], sc[1], sc[2])
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.12 }))
  doc.roundedRect(pillX, pillY, pillW, pillH, pillH / 2, pillH / 2, 'F')
  doc.restoreGraphicsState()
  // dot
  doc.circle(pillX + 3, pillY + pillH / 2, 1, 'F')
  // text
  text(doc, sc)
  doc.text(label, pillX + 6, pillY + 4.2)

  // Execution date (right, below pill)
  text(doc, SUB)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7.5)
  doc.text(`Execution: ${formatDate(transfer.executionDate)}`, W - M, pillY + pillH + 5, { align: 'right' })

  return y + 28
}

// ─── Divider ────────────────────────────────────────────────────────────────
function divider(doc: jsPDF, y: number): number {
  stroke(doc, LINE)
  doc.setLineWidth(0.2)
  doc.line(M, y, W - M, y)
  return y + 6
}

// ─── From → To block (two columns) ──────────────────────────────────────────
function drawFromTo(doc: jsPDF, y: number, src: Account, ben: Beneficiary): number {
  const colW = (W - M * 2 - 8) / 2
  const startY = y

  const drawCol = (x: number, label: string, lines: Array<[string, string]>) => {
    text(doc, SUB)
    doc.setFont('Amiri', 'normal')
    doc.setFontSize(7)
    doc.text(label.toUpperCase(), x, startY)

    let ly = startY + 6
    lines.forEach(([k, v]) => {
      text(doc, SUB)
      doc.setFont('Amiri', 'normal')
      doc.setFontSize(7)
      doc.text(k, x, ly)
      text(doc, INK)
      doc.setFont('Amiri', 'bold')
      doc.setFontSize(9)
      // wrap long values
      const wrapped = doc.splitTextToSize(v, colW)
      doc.text(wrapped, x, ly + 4)
      ly += 4 + wrapped.length * 4 + 3
    })
    return ly
  }

  const fromY = drawCol(M, 'From', [
    ['Bank', src.bankName],
    ['Account', src.accountNumber],
    ['IBAN', src.iban],
    ['Currency', src.currency],
  ])

  const bankFields = Object.entries(ben.bankingData || {}).map(
    ([k, v]) => [k.toUpperCase(), String(v)] as [string, string],
  )
  const toY = drawCol(M + colW + 8, 'To', [
    ['Beneficiary', ben.companyName ? `${ben.name} (${ben.companyName})` : ben.name],
    ['Bank', ben.bankName],
    ['Country', ben.country],
    ...bankFields,
  ])

  // Vertical divider
  stroke(doc, LINE)
  doc.setLineWidth(0.2)
  doc.line(M + colW + 4, startY - 2, M + colW + 4, Math.max(fromY, toY) + 1)

  return Math.max(fromY, toY) + 2
}

// ─── Details rows (key/value) ───────────────────────────────────────────────
function drawDetails(doc: jsPDF, y: number, transfer: Transfer): number {
  text(doc, SUB)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7)
  doc.text('TRANSFER DETAILS', M, y)
  y += 6

  const rows: Array<[string, string]> = [
    ['Reference', transfer.referenceNumber],
    ['Type', transfer.transferType.charAt(0).toUpperCase() + transfer.transferType.slice(1)],
    ['Reason', transfer.transferReason],
    ['Execution date', formatDate(transfer.executionDate)],
    ['Amount', `${formatAmount(Number(transfer.amount))} ${transfer.currency}`],
  ]

  rows.forEach(([k, v], i) => {
    const rowY = y + i * 7
    if (i % 2 === 0) {
      fill(doc, SOFT_BG)
      doc.rect(M - 2, rowY - 4, W - (M - 2) * 2, 7, 'F')
    }
    text(doc, SUB)
    doc.setFont('Amiri', 'normal')
    doc.setFontSize(8.5)
    doc.text(k, M, rowY + 0.8)
    text(doc, INK)
    doc.setFont('Amiri', 'bold')
    doc.setFontSize(8.5)
    const wrapped = doc.splitTextToSize(v, (W - M * 2) * 0.55)
    doc.text(wrapped, W - M, rowY + 0.8, { align: 'right' })
  })

  return y + rows.length * 7 + 4
}

// ─── Notes ──────────────────────────────────────────────────────────────────
function drawNotes(doc: jsPDF, y: number, notes: string): number {
  text(doc, SUB)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7)
  doc.text('NOTES', M, y)
  y += 5
  text(doc, INK)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(9)
  const wrapped = doc.splitTextToSize(notes, W - M * 2)
  doc.text(wrapped, M, y + 3)
  return y + 3 + wrapped.length * 4 + 3
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function drawFooter(doc: jsPDF) {
  const fy = H - 18
  stroke(doc, LINE)
  doc.setLineWidth(0.2)
  doc.line(M, fy, W - M, fy)

  text(doc, SUB)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7)
  doc.text('Thouraya Albilad Trading Co.', M, fy + 5)
  doc.text('Jeddah, Kingdom of Saudi Arabia · CR 4030281022', M, fy + 9)

  doc.text('thourayaalbilad.com', W - M, fy + 5, { align: 'right' })
  doc.text('+966 12 661 4400', W - M, fy + 9, { align: 'right' })

  // Tiny legal line
  text(doc, SUB)
  doc.setFontSize(6.5)
  doc.text(
    'System-generated document — valid without physical signature.',
    W / 2, H - 6, { align: 'center' },
  )
}

// ─── Main ───────────────────────────────────────────────────────────────────
export function generateTransferPDF(data: TransferPDFData): jsPDF {
  const { transfer, sourceAccount, beneficiary } = data
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  setupFonts(doc, AMIRI_REGULAR_BASE64, AMIRI_BOLD_BASE64)
  doc.setFont('Amiri', 'normal')

  let y = drawHeader(doc, transfer)
  y = divider(doc, y + 2)
  y = drawHero(doc, y, transfer)
  y = divider(doc, y + 4)
  y = drawFromTo(doc, y + 2, sourceAccount, beneficiary)
  y = divider(doc, y + 4)
  y = drawDetails(doc, y + 2, transfer)

  if (transfer.notes && transfer.notes.trim().length > 0) {
    y = divider(doc, y + 2)
    y = drawNotes(doc, y + 2, transfer.notes)
  }

  drawFooter(doc)
  return doc
}

export function downloadTransferPDF(data: TransferPDFData, filename?: string) {
  const doc = generateTransferPDF(data)
  const fallback = `Thouraya_Transfer_${data.transfer.referenceNumber}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename || fallback)
}

export function previewTransferPDF(data: TransferPDFData): string {
  const doc = generateTransferPDF(data)
  return doc.output('datauristring')
}
