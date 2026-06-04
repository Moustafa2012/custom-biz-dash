import type jsPDF from 'jspdf'
import { C, fill, stroke, textColor, drawGoldStrip, getStatusColor } from './pdfUtils'
import type { Transfer, Account } from '../data/mock'

// ─── Decorative filigree circle pattern
function drawFiligreeBg(doc: jsPDF, W: number, _headerH: number) {
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.03 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.3)

  // Subtle concentric arcs
  for (let i = 0; i < 4; i++) {
    const r = 40 + i * 18
    doc.circle(W / 2, -10, r, 'S')
  }

  // Corner accents
  doc.setLineWidth(0.4)
  doc.line(0, 0, 20, 20)
  doc.line(W, 0, W - 20, 20)

  doc.restoreGraphicsState()
}

// ─── Logo block (premium embossed medallion)
function drawLogoBlock(doc: jsPDF, logoX: number, logoY: number) {
  // Outer glow ring
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.12 }))
  fill(doc, C.gold)
  doc.circle(logoX, logoY, 13, 'F')
  doc.restoreGraphicsState()

  // Outer ring border
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.55 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.7)
  doc.circle(logoX, logoY, 11.5, 'S')
  doc.restoreGraphicsState()

  // Inner ring
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.35 }))
  stroke(doc, C.goldBright)
  doc.setLineWidth(0.3)
  doc.circle(logoX, logoY, 10, 'S')
  doc.restoreGraphicsState()

  // Gold fill
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.1 }))
  fill(doc, C.gold)
  doc.circle(logoX, logoY, 9.5, 'F')
  doc.restoreGraphicsState()

  // Center symbol
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(14)
  textColor(doc, C.gold)
  doc.text('✦', logoX, logoY + 2, { align: 'center' })

  // Label below medallion
  doc.setFontSize(4.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.55 }))
  textColor(doc, C.goldPale)
  doc.text('OFFICIAL DOCUMENT', logoX, logoY + 10, { align: 'center' })
  doc.restoreGraphicsState()
}

// ─── Title block (premium typography)
function drawTitleBlock(doc: jsPDF, cx: number) {
  // Arabic company name
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(17)
  textColor(doc, C.gold)
  doc.text('ثريا البلاد للتجارة', cx, 14, { align: 'center' })

  // English company name
  doc.setFontSize(8)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.9 }))
  textColor(doc, C.white)
  doc.text('THOURAYA ALBILAD TRADING CO.', cx, 21, { align: 'center' })
  doc.restoreGraphicsState()

  // Gold divider bar
  fill(doc, C.gold)
  doc.rect(cx - 18, 23.5, 36, 0.8, 'F')

  // Shimmer highlight on bar
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  fill(doc, C.goldBright)
  doc.rect(cx - 6, 23.5, 12, 0.4, 'F')
  doc.restoreGraphicsState()

  // Document type (bilingual)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.6 }))
  textColor(doc, C.goldPale)
  doc.text('Wire Transfer Confirmation', cx, 30, { align: 'center' })
  doc.restoreGraphicsState()

  doc.setFont('Amiri', 'bold')
  doc.setFontSize(7.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.55 }))
  textColor(doc, C.gold)
  doc.text('تأكيد أمر التحويل البنكي', cx, 35, { align: 'center' })
  doc.restoreGraphicsState()

  // Website
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(6)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  textColor(doc, C.goldPale)
  doc.text('thourayaalbilad.com', cx, 40, { align: 'center' })
  doc.restoreGraphicsState()
}

// ─── CR block (commercial registration)
function drawCRBlock(doc: jsPDF, W: number) {
  const crX = W - 16

  // Label
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(5.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  textColor(doc, C.goldPale)
  doc.text('السجل التجاري', crX, 10, { align: 'right' })
  doc.text('Commercial Reg.', crX, 14, { align: 'right' })
  doc.restoreGraphicsState()

  // CR number
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(12)
  textColor(doc, C.gold)
  doc.text('4030281022', crX, 22, { align: 'right' })

  // Issue date
  const issueDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(6)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  textColor(doc, C.white)
  doc.text(issueDate, crX, 27, { align: 'right' })
  doc.restoreGraphicsState()

  // Vertical divider with ornamental dots
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.2 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.4)
  doc.line(W - 54, 8, W - 54, 42)
  // Dot accents
  fill(doc, C.gold)
  doc.circle(W - 54, 8, 0.6, 'F')
  doc.circle(W - 54, 42, 0.6, 'F')
  doc.restoreGraphicsState()
}

// ─── Meta bar (status, reference, date)
function drawMetaBar(doc: jsPDF, W: number, transfer: Transfer, metaBarY: number) {
  const metaBarH = 12

  // Dark overlay background
  fill(doc, C.navyDeep)
  doc.rect(0, metaBarY, W, metaBarH, 'F')

  // Subtle gradient overlay
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.3 }))
  fill(doc, C.navy)
  doc.rect(0, metaBarY, W * 0.5, metaBarH, 'F')
  doc.restoreGraphicsState()

  // Status badge (pill shape)
  const statusColor = getStatusColor(transfer.status)
  // Badge background
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.15 }))
  fill(doc, statusColor)
  doc.roundedRect(16, metaBarY + 2, 32, 8, 4, 4, 'F')
  doc.restoreGraphicsState()
  // Badge border
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  stroke(doc, statusColor)
  doc.setLineWidth(0.4)
  doc.roundedRect(16, metaBarY + 2, 32, 8, 4, 4, 'S')
  doc.restoreGraphicsState()
  // Status dot indicator
  fill(doc, statusColor)
  doc.circle(22, metaBarY + 6, 1.2, 'F')
  // Status text
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
  doc.text(transfer.status.toUpperCase(), 34, metaBarY + 7, { align: 'center' })

  // Transfer type badge
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.15 }))
  fill(doc, C.white)
  doc.roundedRect(52, metaBarY + 2, 34, 8, 4, 4, 'F')
  doc.restoreGraphicsState()
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.35 }))
  stroke(doc, C.white)
  doc.setLineWidth(0.3)
  doc.roundedRect(52, metaBarY + 2, 34, 8, 4, 4, 'S')
  doc.restoreGraphicsState()
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(5.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.7 }))
  textColor(doc, C.white)
  doc.text(transfer.transferType.toUpperCase(), 69, metaBarY + 7, { align: 'center' })
  doc.restoreGraphicsState()

  // REF number (centered, gold)
  const cx = W / 2
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(7.5)
  textColor(doc, C.gold)
  doc.text(`REF: ${transfer.referenceNumber}`, cx, metaBarY + 7.5, { align: 'center' })

  // Execution date (right)
  const execDate = transfer.executionDate instanceof Date
    ? transfer.executionDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : String(transfer.executionDate)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(6)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  textColor(doc, C.goldPale)
  doc.text(`Execution: ${execDate}`, W - 16, metaBarY + 7.5, { align: 'right' })
  doc.restoreGraphicsState()
}

// ─── Main header export
export function drawHeader(doc: jsPDF, W: number, transfer: Transfer, _sourceAccount: Account): number {
  const headerH = 46
  const metaBarH = 12
  const totalH = headerH + metaBarH

  // Deep navy background
  fill(doc, C.navyDeep)
  doc.rect(0, 0, W, totalH, 'F')

  // Subtle top gradient highlight
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.15 }))
  fill(doc, C.navyMid)
  doc.rect(0, 0, W, 18, 'F')
  doc.restoreGraphicsState()

  // Decorative filigree
  drawFiligreeBg(doc, W, headerH)

  // Logo medallion
  const logoX = 22
  const logoY = headerH / 2
  drawLogoBlock(doc, logoX, logoY)

  // Vertical divider after logo
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.2 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.35)
  doc.line(38, 8, 38, headerH - 8)
  // Ornamental dots
  fill(doc, C.gold)
  doc.circle(38, 8, 0.5, 'F')
  doc.circle(38, headerH - 8, 0.5, 'F')
  doc.restoreGraphicsState()

  drawTitleBlock(doc, W / 2)
  drawCRBlock(doc, W)
  drawMetaBar(doc, W, transfer, headerH)

  // Premium gold strip
  drawGoldStrip(doc, totalH, W, 2.5)

  return totalH + 2.5
}
