import jsPDF from 'jspdf'
import type { Transfer, Account, Beneficiary } from '../data/mock'
import { AMIRI_REGULAR_BASE64, AMIRI_BOLD_BASE64 } from './Amiri'
import { setupFonts, drawWatermark } from './pdfUtils'
import { drawHeader } from './pdfHeader'
import {
  drawSourceAccountSection,
  drawBeneficiarySection,
  drawTransferDetailsSection,
  drawNotesRow,
} from './pdfSections'
import { drawAmountBox } from './pdfAmountBox'
import { drawFooter } from './pdfFooter'

// ─── Page constants
const W = 210   // A4 width  (mm)
const H = 297   // A4 height (mm)

interface TransferPDFData {
  transfer: Transfer
  sourceAccount: Account
  beneficiary: Beneficiary
}

// ─── Main generator
export function generateTransferPDF(data: TransferPDFData): jsPDF {
  const { transfer, sourceAccount, beneficiary } = data

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  setupFonts(doc, AMIRI_REGULAR_BASE64, AMIRI_BOLD_BASE64)
  drawWatermark(doc, W, H)

  // Header — returns y position immediately after header + gold strip
  let y = drawHeader(doc, W, transfer, sourceAccount)
  y += 5

  // Source Account
  y = drawSourceAccountSection(doc, W, y, sourceAccount)
  y += 5

  // Beneficiary Details
  y = drawBeneficiarySection(doc, W, y, beneficiary)
  y += 5

  // Transfer Details
  y = drawTransferDetailsSection(doc, W, y, transfer)
  y += 4

  // Notes (optional)
  if (transfer.notes && transfer.notes.trim().length > 0) {
    y = drawNotesRow(doc, W, y, transfer.notes)
    y += 5
  } else {
    y += 4
  }

  // Amount Box (anchored to remaining space above footer)
  // Footer occupies bottom 38mm; ensure amount box fits
  const footerReserve = 38
  const amountBoxH = 42
  const availableBottom = H - footerReserve - amountBoxH - 4

  // If content overflows, pin amount box just above footer
  const amountY = Math.max(y, availableBottom)
  drawAmountBox(doc, W, amountY, transfer)

  // Footer
  drawFooter(doc, W, H)

  return doc
}

// ─── Public API

export function downloadTransferPDF(data: TransferPDFData, filename?: string) {
  const doc = generateTransferPDF(data)
  const defaultFilename = `Thouraya_Transfer_${data.transfer.referenceNumber}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename || defaultFilename)
}

export function previewTransferPDF(data: TransferPDFData): string {
  const doc = generateTransferPDF(data)
  return doc.output('datauristring')
}
