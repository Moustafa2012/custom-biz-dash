import type jsPDF from 'jspdf'

// ─── Color palette (premium expanded)
export const C = {
  // Navy spectrum
  navyDeep:    [8, 22, 58]   as const,
  navy:        [12, 35, 72]  as const,
  navyMid:     [18, 48, 96]  as const,
  navyLight:   [26, 63, 122] as const,
  navyFade:    [38, 82, 148] as const,

  // Gold spectrum
  goldDeep:    [156, 120, 28] as const,
  gold:        [212, 175, 55] as const,
  goldBright:  [240, 204, 90] as const,
  goldPale:    [252, 232, 170] as const,
  goldDim:     [180, 148, 42] as const,

  // Neutrals
  white:       [255, 255, 255] as const,
  offWhite:    [250, 251, 254] as const,
  cream:       [253, 250, 243] as const,
  lightBg:     [243, 245, 250] as const,
  paperBg:     [248, 249, 253] as const,
  borderGray:  [224, 228, 236] as const,
  borderLight: [236, 238, 244] as const,
  midGray:     [128, 138, 158] as const,
  darkText:    [22, 32, 56]   as const,

  // Status accents
  accentGreen: [22, 180, 82]  as const,
  accentRed:   [220, 52, 52]  as const,
  accentBlue:  [48, 116, 230] as const,
  accentAmber: [234, 170, 20] as const,

  // Row alternation
  rowAlt:      [246, 248, 253] as const,
  rowHover:    [240, 243, 250] as const,
}

const STATUS_COLORS: Record<string, readonly [number, number, number]> = {
  completed:  C.accentGreen,
  approved:   C.accentGreen,
  sent:       C.accentBlue,
  pending:    C.accentAmber,
  processing: C.accentBlue,
  failed:     C.accentRed,
  rejected:   C.accentRed,
  draft:      C.midGray,
  cancelled:  C.midGray,
}

export function getStatusColor(status: string): readonly [number, number, number] {
  return STATUS_COLORS[status.toLowerCase()] ?? C.accentBlue
}

// ─── Color helpers
export function fill(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setFillColor(color[0], color[1], color[2])
}

export function stroke(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setDrawColor(color[0], color[1], color[2])
}

export function textColor(doc: jsPDF, color: readonly [number, number, number]) {
  doc.setTextColor(color[0], color[1], color[2])
}

// ─── Premium gold gradient strip (multi-stop shimmer)
export function drawGoldStrip(doc: jsPDF, y: number, W: number, h = 2.5) {
  const stops: Array<readonly [number, number, number]> = [
    C.goldDeep, C.goldDim, C.gold, C.goldBright, C.gold, C.goldDim, C.goldDeep,
  ]
  const segW = W / (stops.length - 1)
  stops.forEach((stop, i) => {
    if (i === stops.length - 1) return
    fill(doc, stop)
    doc.rect(i * segW, y, segW + 0.5, h, 'F')
  })

  // Add subtle shimmer highlight in center
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.25 }))
  fill(doc, C.white)
  doc.rect(W * 0.35, y, W * 0.3, h * 0.4, 'F')
  doc.restoreGraphicsState()
}

// ─── Diamond divider ornament
export function drawDiamondDivider(doc: jsPDF, cx: number, y: number, lineW: number) {
  const diamondSize = 2.2

  // Center diamond
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  fill(doc, C.gold)
  doc.triangle(
    cx, y - diamondSize,
    cx + diamondSize, y,
    cx, y + diamondSize,
    'F'
  )
  doc.triangle(
    cx, y - diamondSize,
    cx - diamondSize, y,
    cx, y + diamondSize,
    'F'
  )
  doc.restoreGraphicsState()

  // Side lines
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.2 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.3)
  doc.line(cx - lineW / 2, y, cx - diamondSize - 2, y)
  doc.line(cx + diamondSize + 2, y, cx + lineW / 2, y)
  doc.restoreGraphicsState()
}

// ─── Corner ornament (decorative L-brackets)
export function drawCornerOrnaments(
  doc: jsPDF, x: number, y: number, w: number, h: number, len = 6
) {
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.3 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.5)

  // Top-left
  doc.line(x, y + len, x, y)
  doc.line(x, y, x + len, y)

  // Top-right
  doc.line(x + w - len, y, x + w, y)
  doc.line(x + w, y, x + w, y + len)

  // Bottom-left
  doc.line(x, y + h - len, x, y + h)
  doc.line(x, y + h, x + len, y + h)

  // Bottom-right
  doc.line(x + w - len, y + h, x + w, y + h)
  doc.line(x + w, y + h - len, x + w, y + h)

  doc.restoreGraphicsState()
}

// ─── Embossed panel (raised card effect)
export function drawEmbossedPanel(
  doc: jsPDF, x: number, y: number, w: number, h: number, radius = 2.5
) {
  // Drop shadow
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.06 }))
  fill(doc, C.navyDeep)
  doc.roundedRect(x + 0.8, y + 0.8, w, h, radius, radius, 'F')
  doc.restoreGraphicsState()

  // Main panel
  fill(doc, C.white)
  doc.roundedRect(x, y, w, h, radius, radius, 'F')

  // Top highlight edge
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.04 }))
  fill(doc, C.gold)
  doc.roundedRect(x, y, w, 1.5, radius, radius, 'F')
  doc.restoreGraphicsState()

  // Border
  stroke(doc, C.borderLight)
  doc.setLineWidth(0.3)
  doc.roundedRect(x, y, w, h, radius, radius, 'S')
}

// ─── Watermark (dual-layer with pattern)
export function drawWatermark(doc: jsPDF, W: number, H: number) {
  // Primary watermark text
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.018 }))
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(64)
  doc.setTextColor(12, 35, 72)
  doc.text('THOURAYA', W / 2, H / 2 - 10, { align: 'center', angle: -30 })
  doc.restoreGraphicsState()

  // Secondary Arabic watermark
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.015 }))
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(52)
  doc.setTextColor(212, 175, 55)
  doc.text('ثريا', W / 2, H / 2 + 20, { align: 'center', angle: -30 })
  doc.restoreGraphicsState()

  // Subtle border frame
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.035 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.4)
  doc.roundedRect(12, 62, W - 24, H - 100, 4, 4, 'S')
  doc.restoreGraphicsState()
}

// ─── Font setup
export function setupFonts(doc: jsPDF, amiriRegularBase64: string, amiriBoldBase64: string) {
  doc.addFileToVFS('Amiri-Regular.ttf', amiriRegularBase64)
  doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal')
  doc.addFileToVFS('Amiri-Bold.ttf', amiriBoldBase64)
  doc.addFont('Amiri-Bold.ttf', 'Amiri', 'bold')
}

// ─── Section header bar (premium redesign)
export function drawSectionHeader(
  doc: jsPDF, W: number,
  labelEn: string, labelAr: string, y: number
) {
  const margin = 16

  // Background bar with gradient feel
  fill(doc, C.lightBg)
  doc.roundedRect(margin, y, W - margin * 2, 8, 1.5, 1.5, 'F')

  // Gold accent bar (left)
  fill(doc, C.gold)
  doc.roundedRect(margin, y, 3, 8, 1, 1, 'F')

  // Gold accent dot (right)
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.5 }))
  fill(doc, C.gold)
  doc.circle(W - margin - 4, y + 4, 1.2, 'F')
  doc.restoreGraphicsState()

  // English label
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(7.5)
  textColor(doc, C.navy)
  doc.text(labelEn.toUpperCase(), margin + 7, y + 5.2)

  // Decorative dotted line between labels
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.25 }))
  stroke(doc, C.gold)
  doc.setLineWidth(0.3)
  doc.setLineDashPattern([0.8, 1.5], 0)
  const enEndX = margin + 7 + (labelEn.length * 2.2)
  const arStartX = W - margin - 8 - (labelAr.length * 2.0)
  doc.line(enEndX + 4, y + 4, arStartX - 4, y + 4)
  doc.setLineDashPattern([], 0)
  doc.restoreGraphicsState()

  // Arabic label
  doc.setFont('Amiri', 'bold')
  doc.setFontSize(8.5)
  textColor(doc, C.navy)
  doc.text(labelAr, W - margin - 8, y + 5.5, { align: 'right' })
}

// ─── Individual data cell (premium card style)
interface CellOpts {
  alt?: boolean
  valueColor?: readonly [number, number, number]
  mono?: boolean
}

export function drawDataCell(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  labelEn: string, labelAr: string,
  value: string,
  opts: CellOpts = {}
) {
  // Cell background
  fill(doc, opts.alt ? C.rowAlt : C.white)
  doc.rect(x, y, w, h, 'F')

  // Subtle inner shadow at top
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.03 }))
  fill(doc, C.navyDeep)
  doc.rect(x, y, w, 1, 'F')
  doc.restoreGraphicsState()

  // Cell border
  stroke(doc, C.borderLight)
  doc.setLineWidth(0.2)
  doc.rect(x, y, w, h, 'S')

  // Label row (bilingual)
  doc.setFont('Amiri', 'normal')
  doc.setFontSize(5.5)
  textColor(doc, C.midGray)
  doc.text(labelEn.toUpperCase(), x + 4, y + 4.5)
  doc.text(labelAr, x + w - 4, y + 4.5, { align: 'right' })

  // Micro separator line under labels
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.1 }))
  stroke(doc, C.borderGray)
  doc.setLineWidth(0.2)
  doc.line(x + 4, y + 6, x + w - 4, y + 6)
  doc.restoreGraphicsState()

  // Value
  if (opts.mono) {
    doc.setFont('Courier', 'bold')
    doc.setFontSize(8)
  } else {
    doc.setFont('Amiri', 'bold')
    doc.setFontSize(9)
  }
  textColor(doc, opts.valueColor ?? C.darkText)
  doc.text(value, x + w / 2, y + h - 3, { align: 'center' })

  doc.setFont('Amiri', 'normal')
}

// ─── Card grid renderer (2 or 3 columns)
export interface GridCell {
  labelEn: string
  labelAr: string
  value: string
  mono?: boolean
  fullWidth?: boolean
  valueColor?: readonly [number, number, number]
}

export function drawCardGrid(
  doc: jsPDF,
  W: number,
  y: number,
  cells: GridCell[],
  cols = 2
): number {
  const margin = 16
  const gridW = W - margin * 2
  const colW = gridW / cols
  const rowH = 17

  let currentRow = 0
  let currentCol = 0

  cells.forEach((cell) => {
    const spanCols = cell.fullWidth ? cols : 1
    const cellX = margin + currentCol * colW
    const cellY = y + currentRow * rowH
    const cellW = colW * spanCols

    drawDataCell(
      doc,
      cellX, cellY, cellW, rowH,
      cell.labelEn, cell.labelAr, cell.value,
      {
        alt: (currentRow + currentCol) % 2 === 1,
        mono: cell.mono,
        valueColor: cell.valueColor,
      }
    )

    if (cell.fullWidth) {
      currentCol = 0
      currentRow++
    } else {
      currentCol += spanCols
      if (currentCol >= cols) {
        currentCol = 0
        currentRow++
      }
    }
  })

  // Fill trailing empty cell if odd count
  if (!cells[cells.length - 1]?.fullWidth && currentCol > 0) {
    currentRow++
  }

  const totalH = currentRow * rowH

  // Outer rounded border with shadow effect
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.05 }))
  fill(doc, C.navyDeep)
  doc.roundedRect(margin + 0.6, y + totalH - 0.2, gridW, 1.5, 0.5, 0.5, 'F')
  doc.restoreGraphicsState()

  stroke(doc, C.borderGray)
  doc.setLineWidth(0.4)
  doc.roundedRect(margin, y, gridW, totalH, 2.5, 2.5, 'S')

  // Gold accent line at top of grid
  doc.saveGraphicsState()
  doc.setGState(new (doc as any).GState({ opacity: 0.35 }))
  fill(doc, C.gold)
  doc.roundedRect(margin, y, gridW, 0.6, 2.5, 2.5, 'F')
  doc.restoreGraphicsState()

  return y + totalH
}
