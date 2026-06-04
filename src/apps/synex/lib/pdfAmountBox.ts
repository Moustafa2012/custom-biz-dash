import type jsPDF from 'jspdf'
import { C, fill, stroke, textColor, drawCornerOrnaments } from './pdfUtils'
import type { Transfer } from '../data/mock'

// ─── Number to English words
function tensToWords(n: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  if (n < 20) return ones[n]
  return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
}

function hundredsToWords(n: number): string {
  if (n === 0) return ''
  if (n < 100) return tensToWords(n)
  return ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][Math.floor(n / 100)]
    + ' Hundred' + (n % 100 ? ' and ' + tensToWords(n % 100) : '')
}

export function numberToEnglishWords(amount: number, currency: string): string {
  const rounded = Math.round(amount * 100) / 100
  const intPart = Math.floor(rounded)
  const decPart = Math.round((rounded - intPart) * 100)

  const groups: string[] = []
  const scales = ['', 'Thousand', 'Million', 'Billion']
  let n = intPart
  let scale = 0
  while (n > 0) {
    const chunk = n % 1000
    if (chunk > 0) {
      const words = hundredsToWords(chunk)
      groups.unshift(words + (scales[scale] ? ' ' + scales[scale] : ''))
    }
    n = Math.floor(n / 1000)
    scale++
  }

  const intWords = groups.join(', ') || 'Zero'
  const decWords = decPart > 0 ? ` and ${tensToWords(decPart)} Cents` : ' Only'

  return `${intWords} ${currency}${decWords}`
}

// ─── Number to Arabic words (simplified)
function onesAr(n: number): string {
  const w = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
    'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر',
    'سبعة عشر', 'ثمانية عشر', 'تسعة عشر']
  return w[n] || ''
}
function tensAr(n: number): string {
  if (n < 20) return onesAr(n)
  const t = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون']
  return t[Math.floor(n / 10)] + (n % 10 ? ' و' + onesAr(n % 10) : '')
}
function hundredsAr(n: number): string {
  if (n === 0) return ''
  if (n < 100) return tensAr(n)
  const h = ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة']
  return h[Math.floor(n / 100)] + (n % 100 ? ' و' + tensAr(n % 100) : '')
}

export function numberToArabicWords(amount: number, currency: string): string {
  const rounded = Math.round(amount * 100) / 100
  const intPart = Math.floor(rounded)
  const decPart = Math.round((rounded - intPart) * 100)

  const scales = ['', 'ألف', 'مليون', 'مليار']
  const groups: string[] = []
  let n = intPart
  let scale = 0
  while (n > 0) {
    const chunk = n % 1000
    if (chunk > 0) {
      groups.unshift(hundredsAr(chunk) + (scales[scale] ? ' ' + scales[scale] : ''))
    }
    n = Math.floor(n / 1000)
    scale++
  }

  const intWords = groups.join(' و') || 'صفر'
  const decWords = decPart > 0 ? ` و${tensAr(decPart)} هللة` : ' فقط'

  return `${intWords} ${currency}${decWords}`
}

// ─── Draw QR Placeholder (premium pattern)
function drawQRPlaceholder(doc: jsPDF, x: number, y: number, size: number) {
  // Background
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.08 }))
  fill(doc, C.gold)
  doc.roundedRect(x, y, size, size, 2.5, 2.5, 'F')
  doc.restoreGraphicsState()

  // Border
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.5)
  doc.roundedRect(x, y, size, size, 2.5, 2.5, 'S')
  doc.restoreGraphicsState()

  // Inner border
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.2 }))
  stroke(doc, C.goldBright)
  doc.setLineWidth(0.3)
  doc.roundedRect(x + 1.5, y + 1.5, size - 3, size - 3, 1.5, 1.5, 'S')
  doc.restoreGraphicsState()

  // QR dot matrix pattern (simulated)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  fill(doc, C.gold)

  // Finder patterns (3 corners)
  const finderPositions = [
    { fx: x + 3.5, fy: y + 3.5 },
    { fx: x + size - 7.5, fy: y + 3.5 },
    { fx: x + 3.5, fy: y + size - 7.5 },
  ]
  finderPositions.forEach(({ fx, fy }) => {
    doc.roundedRect(fx, fy, 4, 4, 0.5, 0.5, 'F')
    doc.saveGraphicsState()
    doc.setGState(new (doc as any).GState({ opacity: 0.3 }))
    fill(doc, C.navyDeep)
    doc.roundedRect(fx + 1, fy + 1, 2, 2, 0.3, 0.3, 'F')
    doc.restoreGraphicsState()
  })

  // Data dots
  const dotR = 0.6
  const dataPositions = [
    [3, 4], [4, 3], [5, 5], [4, 5], [5, 4],
    [3, 6], [6, 3], [5, 6], [6, 5], [6, 6],
    [4, 7], [7, 4], [7, 7], [5, 7], [7, 5],
  ]
  const cellSize = (size - 7) / 8
  dataPositions.forEach(([dx, dy]) => {
    doc.circle(x + 3.5 + dx * cellSize, y + 3.5 + dy * cellSize, dotR, 'F')
  })

  doc.restoreGraphicsState()

  // Label
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(4.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  textColor(doc, C.goldPale)
  doc.text('SCAN', x + size / 2, y + size - 2, { align: 'center' })
  doc.restoreGraphicsState()
}

// ─── Main amount box (premium flagship component)
export function drawAmountBox(doc: jsPDF, W: number, y: number, transfer: Transfer): number {
  const margin = 16
  const boxH = 42
  const boxW = W - margin * 2

  // ── Outer glow shadow
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.06 }))
  fill(doc, C.navyDeep)
  doc.roundedRect(margin + 1, y + 1.2, boxW, boxH, 4, 4, 'F')
  doc.restoreGraphicsState()

  // ── Navy gradient background
  fill(doc, C.navyDeep)
  doc.roundedRect(margin, y, boxW, boxH, 4, 4, 'F')

  // Subtle lighter overlay on top half
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.08 }))
  fill(doc, C.navyMid)
  doc.roundedRect(margin, y, boxW, boxH * 0.5, 4, 4, 'F')
  doc.restoreGraphicsState()

  // ── Gold border (double stroke effect)
  stroke(doc, C.gold)
  doc.setLineWidth(0.7)
  doc.roundedRect(margin, y, boxW, boxH, 4, 4, 'S')

  // Inner border
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.25 }))
  stroke(doc, C.goldBright)
  doc.setLineWidth(0.3)
  doc.roundedRect(margin + 1.5, y + 1.5, boxW - 3, boxH - 3, 3, 3, 'S')
  doc.restoreGraphicsState()

  // ── Corner ornaments
  drawCornerOrnaments(doc, margin + 3, y + 3, boxW - 6, boxH - 6, 5)

  // ── Left accent bar
  fill(doc, C.gold)
  doc.roundedRect(margin, y, 3.5, boxH, 2, 2, 'F')

  // Gradient effect on accent bar
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  fill(doc, C.goldBright)
  doc.roundedRect(margin, y, 3.5, boxH * 0.3, 2, 2, 'F')
  doc.restoreGraphicsState()

  // ── Divider line separating amount from words
  const divY = y + 22
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.2 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.3)
  doc.line(margin + 10, divY, W - margin - 38, divY)
  // Center diamond on divider
  fill(doc, C.gold)
  const dMid = (margin + 10 + W - margin - 38) / 2
  doc.circle(dMid, divY, 0.8, 'F')
  doc.restoreGraphicsState()

  // ── Amount label (bilingual)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(6)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  textColor(doc, C.goldPale)
  doc.text('إجمالي مبلغ التحويل', margin + 10, y + 6)
  doc.restoreGraphicsState()

  doc.setFontSize(5.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  textColor(doc, C.goldPale)
  doc.text('TOTAL TRANSFER AMOUNT', margin + 10, y + 10)
  doc.restoreGraphicsState()

  // ── Amount value (large, prominent)
  const formatted = Number(transfer.amount).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(22)
  textColor(doc, C.gold)
  doc.text(formatted, margin + 10, y + 20)

  // Currency label
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(11)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.65 }))
  textColor(doc, C.goldBright)
  void doc.getTextWidth(formatted) * (22 / doc.getFontSize())
  doc.text(transfer.currency, margin + 12 + (formatted.length * 5), y + 20)
  doc.restoreGraphicsState()

  // ── Amount in words (English)
  const enWords = numberToEnglishWords(Number(transfer.amount), transfer.currency)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(6.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.7 }))
  textColor(doc, C.white)
  doc.text(enWords, margin + 10, divY + 6)
  doc.restoreGraphicsState()

  // ── Amount in words (Arabic)
  const arWords = numberToArabicWords(Number(transfer.amount), transfer.currency)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.55 }))
  textColor(doc, C.gold)
  doc.text(arWords, W - margin - 38, divY + 8, { align: 'right' })
  doc.restoreGraphicsState()

  // ── QR placeholder (right column)
  const qrSize = 30
  const qrX = W - margin - qrSize - 4
  const qrY = y + 5
  drawQRPlaceholder(doc, qrX, qrY, qrSize)

  // SWIFT label at bottom right
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  textColor(doc, C.goldPale)
  doc.text('SWIFT TRANSFER', W - margin - 5, y + boxH - 3, { align: 'right' })
  doc.restoreGraphicsState()

  return y + boxH
}
