import type jsPDF from 'jspdf'
import { C, fill, stroke, textColor, drawSectionHeader, drawCardGrid } from './pdfUtils'
import type { Transfer, Account, Beneficiary } from '../data/mock'

// ─── Source Account Section
export function drawSourceAccountSection(
  doc: jsPDF, W: number, y: number, sourceAccount: Account
): number {
  drawSectionHeader(doc, W, 'Source Account', 'الحساب المصدر', y)
  y += 10

  const fields = [
    { labelEn: 'Bank', labelAr: 'البنك', value: sourceAccount.bankName },
    { labelEn: 'Account No.', labelAr: 'رقم الحساب', value: sourceAccount.accountNumber, mono: true },
    { labelEn: 'Currency', labelAr: 'العملة', value: sourceAccount.currency },
    { labelEn: 'IBAN', labelAr: 'الآيبان', value: sourceAccount.iban, mono: true, fullWidth: true },
  ]

  return drawCardGrid(doc, W, y, fields, 3)
}

// ─── Beneficiary Section
export function drawBeneficiarySection(
  doc: jsPDF, W: number, y: number, beneficiary: Beneficiary
): number {
  drawSectionHeader(doc, W, 'Beneficiary Details', 'بيانات المستفيد', y)
  y += 10

  const fields = [
    { labelEn: 'Name', labelAr: 'الاسم', value: beneficiary.name },
    ...(beneficiary.companyName
      ? [{ labelEn: 'Company', labelAr: 'الشركة', value: beneficiary.companyName }]
      : []),
    { labelEn: 'Bank', labelAr: 'البنك', value: beneficiary.bankName },
    { labelEn: 'Country', labelAr: 'الدولة', value: beneficiary.country },
    ...Object.entries(beneficiary.bankingData).map(([key, value]) => ({
      labelEn: key.toUpperCase(),
      labelAr: key.toUpperCase(),
      value: String(value),
      mono: true,
    })),
  ]

  return drawCardGrid(doc, W, y, fields, 3)
}

// ─── Transfer Details Section
export function drawTransferDetailsSection(
  doc: jsPDF, W: number, y: number, transfer: Transfer
): number {
  drawSectionHeader(doc, W, 'Transfer Details', 'تفاصيل التحويل', y)
  y += 10

  const execDate = transfer.executionDate instanceof Date
    ? transfer.executionDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : String(transfer.executionDate)

  const fields = [
    { labelEn: 'Transfer Type', labelAr: 'نوع التحويل', value: transfer.transferType },
    { labelEn: 'Reason', labelAr: 'السبب', value: transfer.transferReason },
    { labelEn: 'Execution Date', labelAr: 'تاريخ التنفيذ', value: execDate },
  ]

  return drawCardGrid(doc, W, y, fields, 3)
}

// ─── Notes Row (premium card style)
export function drawNotesRow(
  doc: jsPDF, W: number, y: number, notes: string
): number {
  const rowH = 15
  const margin = 16
  const boxW = W - margin * 2

  // Drop shadow
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.04 }))
  fill(doc, C.navyDeep)
  doc.roundedRect(margin + 0.6, y + 0.6, boxW, rowH, 2.5, 2.5, 'F')
  doc.restoreGraphicsState()

  // Main background
  fill(doc, C.cream)
  doc.roundedRect(margin, y, boxW, rowH, 2.5, 2.5, 'F')

  // Border
  stroke(doc, C.borderLight)
  doc.setLineWidth(0.3)
  doc.roundedRect(margin, y, boxW, rowH, 2.5, 2.5, 'S')

  // Gold accent on left
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  fill(doc, C.gold)
  doc.roundedRect(margin, y, 2.5, rowH, 1.5, 1.5, 'F')
  doc.restoreGraphicsState()

  // Labels
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(6)
  textColor(doc, C.midGray)
  doc.text('NOTES', margin + 7, y + 5)

  doc.setFont('Amiri', 'normal')
  doc.setFontSize(7)
  textColor(doc, C.midGray)
  doc.text('ملاحظات', W - margin - 6, y + 5, { align: 'right' })

  // Micro divider
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.1 }))
  stroke(doc, C.borderGray)
  doc.setLineWidth(0.2)
  doc.line(margin + 7, y + 7, W - margin - 6, y + 7)
  doc.restoreGraphicsState()

  // Notes text
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(8.5)
  textColor(doc, C.darkText)
  doc.text(notes, W / 2, y + 12, { align: 'center' })

  return y + rowH
}
