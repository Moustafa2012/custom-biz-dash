import type jsPDF from 'jspdf'
import { C, fill, stroke, textColor, drawGoldStrip, drawDiamondDivider } from './pdfUtils'

export function drawFooter(doc: jsPDF, W: number, H: number) {
  const footH = 38
  const footY = H - footH

  // ── Footer background with subtle gradient
  fill(doc, C.cream)
  doc.rect(0, footY, W, footH, 'F')

  // Top overlay for depth
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.03 }))
  fill(doc, C.navyDeep)
  doc.rect(0, footY, W, 4, 'F')
  doc.restoreGraphicsState()

  // Premium gold strip at top of footer
  drawGoldStrip(doc, footY, W, 1.8)

  // ── Diamond ornament separator
  drawDiamondDivider(doc, W / 2, footY + 6, W - 60)

  // ── Address EN (left column)
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(6.5)
  textColor(doc, C.navy)
  doc.text('Thouraya Albilad Trading Co.', 18, footY + 12)

  doc.setFont('Amiri', 'normal')
  doc.setFontSize(6)
  textColor(doc, C.midGray)
  doc.text('Madinah Road, Al-Rawdah District', 18, footY + 16)
  doc.text('Jeddah 23411, Kingdom of Saudi Arabia', 18, footY + 20)

  // ── Center block (contact info)
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(7.5)
  textColor(doc, C.navy)
  doc.text('+966 12 661 4400', W / 2, footY + 12, { align: 'center' })

  doc.setFont('Amiri', 'normal')
  doc.setFontSize(6.5)
  textColor(doc, C.midGray)
  doc.text('هاتف: ٩٦٦ ١٢ ٦٦١ ٤٤٠٠+', W / 2, footY + 16.5, { align: 'center' })

  doc.setFont('Amiri', 'bold')
  doc.setFontSize(6.5)
  textColor(doc, C.navy)
  doc.text('thourayaalbilad.com', W / 2, footY + 21, { align: 'center' })

  // ── Address AR (right column)
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(6.5)
  textColor(doc, C.navy)
  doc.text('ثريا البلاد للتجارة', W - 18, footY + 12, { align: 'right' })

  doc.setFont('Amiri', 'normal')
  doc.setFontSize(6)
  textColor(doc, C.midGray)
  doc.text('طريق المدينة المنورة، حي الروضة', W - 18, footY + 16, { align: 'right' })
  doc.text('جدة ٢٣٤١١، المملكة العربية السعودية', W - 18, footY + 20, { align: 'right' })

  // ── Separator line
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.3 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.3)
  doc.line(18, footY + 24, W - 18, footY + 24)
  doc.restoreGraphicsState()

  // ── Official document notice (centered)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(5.5)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.45 }))
  textColor(doc, C.midGray)
  doc.text(
    'OFFICIAL DOCUMENT  ·  وثيقة رسمية  ·  System-generated — valid without physical signature',
    W / 2, footY + 27.5,
    { align: 'center' }
  )
  doc.restoreGraphicsState()

  // ── Signature blocks with decorative lines
  // Left signature
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.35)
  doc.line(22, footY + 35, 72, footY + 35)
  // Decorative dots
  fill(doc, C.gold)
  doc.circle(22, footY + 35, 0.5, 'F')
  doc.circle(72, footY + 35, 0.5, 'F')
  doc.restoreGraphicsState()

  // Right signature
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.4 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.35)
  doc.line(W - 72, footY + 35, W - 22, footY + 35)
  fill(doc, C.gold)
  doc.circle(W - 72, footY + 35, 0.5, 'F')
  doc.circle(W - 22, footY + 35, 0.5, 'F')
  doc.restoreGraphicsState()

  doc.setFont('Amiri', 'normal')
  doc.setFontSize(5.5)
  textColor(doc, C.midGray)
  doc.text('Authorized Signature / التوقيع المعتمد', 47, footY + 38, { align: 'center' })
  doc.text('Official Stamp / الختم الرسمي', W - 47, footY + 38, { align: 'center' })

  // ── Bottom gold strip
  drawGoldStrip(doc, H - 2.5, W, 2.5)
}
