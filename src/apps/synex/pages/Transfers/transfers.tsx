import { useEffect, useMemo, useState, useCallback } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { t } from '@/lib/translations'
import {
  IconPlus, IconTrash, IconArchive,
  IconSend, IconCopy,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '../../components/StatusBadge'
import { CurrencyAmount } from '../../components/CurrencyAmount'
import { TransferActions } from '../../components/TransferActions'
import { useSynex } from '../../store/synex-store'
import { Link, useNavigate } from 'react-router-dom'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { Transfer } from '../../data/mock'
import { useDataTable } from '@/hooks/use-data-table'
import { motion } from 'framer-motion'
import {
  DataTable, DataTableSkeleton, DataTableColumnHeader, DataTableSortList,
  DataTableFilterMenu, DataTableAdvancedToolbar, BulkActions, ExportButton,
  TableActions, CopyableCell, CellWithIcon, KeyboardShortcutsHelp,
  RowDetailsSheet, DetailItem, DetailSection, RowGroupingButton, GroupHeader,
  useGroupedData, useTableKeyboardShortcuts,
  type ExtendedColumnFilter, type GroupableColumn,
} from '@/components/ui/data-table'

// ─── Shared animation variants ────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
}

// ─── Filter functions ─────────────────────────────────────────────────────────

const multiSelectFilterFn: FilterFn<Transfer> = (row, columnId, filterValues: string[]) => {
  if (!filterValues?.length) return true
  return filterValues.includes(String(row.getValue(columnId)))
}
multiSelectFilterFn.autoRemove = (val: string[]) => !val?.length

const textFilterFn: FilterFn<Transfer> = (row, columnId, filterValue: string) => {
  if (!filterValue) return true
  return String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase())
}
textFilterFn.autoRemove = (val: string) => !val

const numberFilterFn: FilterFn<Transfer> = (row, columnId, filterValue: string) => {
  if (!filterValue) return true
  return String(row.getValue(columnId)) === String(filterValue)
}
numberFilterFn.autoRemove = (val: string) => !val

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { dot: string; label: { ar: string; en: string } }> = {
  draft:            { dot: 'bg-muted-foreground', label: { ar: 'مسودة',           en: 'Draft'            } },
  pending:          { dot: 'bg-yellow-500',       label: { ar: 'قيد الانتظار',    en: 'Pending'          } },
  pending_approval: { dot: 'bg-yellow-500',       label: { ar: 'بانتظار الموافقة', en: 'Pending Approval' } },
  approved:         { dot: 'bg-sky-500',          label: { ar: 'تمت الموافقة',    en: 'Approved'         } },
  sent:             { dot: 'bg-blue-500',         label: { ar: 'تم الإرسال',      en: 'Sent'             } },
  settled:          { dot: 'bg-emerald-500',      label: { ar: 'تمت التسوية',     en: 'Settled'          } },
  completed:        { dot: 'bg-emerald-500',      label: { ar: 'مكتمل',           en: 'Completed'        } },
  rejected:         { dot: 'bg-destructive',      label: { ar: 'مرفوض',           en: 'Rejected'         } },
  cancelled:        { dot: 'bg-muted-foreground', label: { ar: 'ملغي',            en: 'Cancelled'        } },
  voided:           { dot: 'bg-destructive',      label: { ar: 'مُبطل',           en: 'Voided'           } },
  failed:           { dot: 'bg-destructive',      label: { ar: 'فشل',             en: 'Failed'           } },
}

// ─── Groupable columns ────────────────────────────────────────────────────────

const GROUPABLE_COLUMNS: GroupableColumn[] = [
  { id: 'status',   label: t('الحالة',   'Status')   },
  { id: 'currency', label: t('العملة',   'Currency') },
  { id: 'country',  label: t('الدولة',   'Country')  },
]

// ─── TransfersPage ────────────────────────────────────────────────────────────

export default function TransfersPage() {
  const { state, loadFromStorage, deleteTransfer } = useSynex()
  const navigate = useNavigate()

  const [activeFilters, setActiveFilters] = useState<ExtendedColumnFilter<Transfer>[]>([])
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFromStorage()
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [loadFromStorage])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm(t('هل أنت متأكد من حذف هذا التحويل؟', 'Are you sure you want to delete this transfer?'))) {
        deleteTransfer(id)
      }
    },
    [deleteTransfer],
  )

  const handleView = useCallback((transfer: Transfer) => {
    navigate(`/synex/transfers/${transfer.id}`)
  }, [navigate])

  const handleDownloadPDF = useCallback((transfer: Transfer) => {
    navigate(`/synex/transfers/${transfer.id}/document`)
  }, [navigate])

  const handleArchive = useCallback((id: string) => {
    console.log('Archive:', id)
  }, [])

  const handleBulkDelete = useCallback(
    async (ids: string[]) => { for (const id of ids) deleteTransfer(id) },
    [deleteTransfer],
  )

  const handleBulkActivate = useCallback(async (ids: string[]) => {
    console.log('Activate transfers:', ids)
  }, [])

  // ── Grouping ──────────────────────────────────────────────────────────────

  const getGroupValue = useCallback((item: Transfer, key: string): string => {
    return String((item as any)[key] ?? '—')
  }, [])

  const { groupedData, expandedGroups, toggleGroup } = useGroupedData(
    state.transfers, activeGroup, getGroupValue,
  )

  useTableKeyboardShortcuts({
    onClearSelection: () => table?.resetRowSelection(),
    onSelectAll: () => table?.toggleAllRowsSelected(true),
  })

  // ── Columns ───────────────────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<Transfer>[]>(
    () => [
      {
        id: 'select',
        enableHiding: false, enableSorting: false, enableColumnFilter: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label={t('تحديد الكل', 'Select all')}
            className="translate-y-px"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label={t('تحديد الصف', 'Select row')}
            className="translate-y-px"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        size: 40,
      },
      {
        accessorKey: 'referenceNumber',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('رقم المرجع', 'Ref #')} />,
        cell: ({ row }) => (
          <CopyableCell value={row.original.referenceNumber}>
            <span className="font-mono text-xs tracking-wider text-foreground bg-muted/50 px-2 py-0.5 rounded-lg border border-border/50">
              {row.original.referenceNumber}
            </span>
          </CopyableCell>
        ),
        filterFn: textFilterFn,
        meta: {
          label: t('رقم المرجع', 'Ref #'),
          variant: 'text' as const,
          placeholder: t('بحث بالمرجع...', 'Search ref...'),
        },
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'sourceAccountId',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('الحساب', 'Account')} />,
        cell: ({ row }) => {
          const account = state.accounts.find((a) => a.id === row.original.sourceAccountId)
          return (
            <CellWithIcon avatar={{ fallback: (account?.bankName?.[0] ?? 'B').toUpperCase(), size: '8' }}>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{account?.bankName ?? row.original.sourceAccountId}</span>
                {account?.accountNumber && (
                  <span className="text-xs text-muted-foreground font-mono">•••• {account.accountNumber.slice(-4)}</span>
                )}
              </div>
            </CellWithIcon>
          )
        },
        meta: { label: t('الحساب', 'Account') },
        enableSorting: true, enableColumnFilter: false,
      },
      {
        accessorKey: 'beneficiaryId',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('المستفيد', 'Beneficiary')} />,
        cell: ({ row }) => {
          const beneficiary = state.beneficiaries.find((b) => b.id === row.original.beneficiaryId)
          const name = beneficiary?.name ?? row.original.beneficiaryId
          return (
            <CellWithIcon avatar={{ fallback: name.slice(0, 2).toUpperCase(), size: '8' }}>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{name}</span>
                {beneficiary?.bankName && (
                  <span className="text-xs text-muted-foreground truncate">{beneficiary.bankName}</span>
                )}
              </div>
            </CellWithIcon>
          )
        },
        meta: { label: t('المستفيد', 'Beneficiary') },
        enableSorting: true, enableColumnFilter: false,
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('المبلغ', 'Amount')} />,
        cell: ({ row }) => (
          <div className="tabular-nums font-semibold">
            <CurrencyAmount amount={row.original.amount} currency={row.original.currency} />
          </div>
        ),
        filterFn: numberFilterFn,
        meta: { label: t('المبلغ', 'Amount'), variant: 'number' as const },
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('الحالة', 'Status')} />,
        cell: ({ row }) => {
          const cfg = STATUS_CONFIG[row.original.status]
          return (
            <div className="flex items-center gap-2">
              <span className={`inline-block size-1.5 rounded-full flex-shrink-0 ${cfg?.dot ?? 'bg-muted'}`} />
              <StatusBadge status={row.original.status} showIcon />
            </div>
          )
        },
        filterFn: multiSelectFilterFn,
        meta: {
          label: t('الحالة', 'Status'),
          variant: 'multiSelect' as const,
          options: Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({
            label: t(cfg.label.ar, cfg.label.en), value,
          })),
        },
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'currency',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('العملة', 'Currency')} />,
        cell: ({ row }) => (
          <Badge variant="outline" className="font-mono text-xs font-semibold tracking-widest rounded-lg">
            {row.original.currency}
          </Badge>
        ),
        filterFn: multiSelectFilterFn,
        meta: {
          label: t('العملة', 'Currency'),
          variant: 'multiSelect' as const,
          options: [
            { label: 'SAR — Saudi Riyal',   value: 'SAR' },
            { label: 'USD — US Dollar',      value: 'USD' },
            { label: 'EUR — Euro',           value: 'EUR' },
            { label: 'AED — Emirati Dirham', value: 'AED' },
            { label: 'GBP — British Pound',  value: 'GBP' },
            { label: 'INR — Indian Rupee',   value: 'INR' },
          ],
        },
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'country',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('الدولة', 'Country')} />,
        cell: ({ row }) => {
          const flags: Record<string, string> = { SA: '🇸🇦', AE: '🇦🇪', US: '🇺🇸', GB: '🇬🇧', IN: '🇮🇳' }
          const labels: Record<string, string> = {
            SA: t('السعودية', 'Saudi Arabia'), AE: t('الإمارات', 'UAE'),
            US: t('أمريكا', 'USA'), GB: t('بريطانيا', 'UK'), IN: t('الهند', 'India'),
          }
          const code = row.original.country
          return (
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{flags[code] ?? '🌐'}</span>
              <span className="text-sm">{labels[code] ?? code}</span>
            </div>
          )
        },
        filterFn: multiSelectFilterFn,
        meta: {
          label: t('الدولة', 'Country'),
          variant: 'multiSelect' as const,
          options: [
            { label: t('السعودية', 'Saudi Arabia'), value: 'SA' },
            { label: t('الإمارات', 'UAE'),          value: 'AE' },
            { label: t('أمريكا', 'USA'),            value: 'US' },
            { label: t('بريطانيا', 'UK'),           value: 'GB' },
            { label: t('الهند', 'India'),           value: 'IN' },
          ],
        },
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('التاريخ', 'Date')} />,
        cell: ({ row }) => {
          const date = row.original.createdAt ? new Date(row.original.createdAt) : null
          if (!date) return <span className="text-muted-foreground text-xs">—</span>
          return (
            <div className="flex flex-col tabular-nums">
              <span className="text-sm">{date.toLocaleDateString()}</span>
              <span className="text-xs text-muted-foreground">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )
        },
        meta: { label: t('التاريخ', 'Date') },
        enableSorting: true, enableColumnFilter: false,
      },
      {
        id: 'actions',
        enableHiding: false, enableSorting: false, enableColumnFilter: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <TransferActions transfer={row.original} variant="row" />
            <TableActions
              data={row.original}
              onView={handleView}
              onDownload={handleDownloadPDF}
              onDelete={(transfer) => handleDelete(transfer.id)}
              confirmDelete
              deleteMessage={t(
                'هل أنت متأكد من حذف هذا التحويل؟ لا يمكن التراجع عن هذا الإجراء.',
                'Are you sure you want to delete this transfer? This action cannot be undone.',
              )}
              actions={[
                {
                  id: 'archive',
                  label: t('أرشفة', 'Archive'),
                  icon: <IconArchive className="w-4 h-4" />,
                  onClick: (transfer: Transfer) => handleArchive(transfer.id),
                },
                {
                  id: 'copy-ref',
                  label: t('نسخ المرجع', 'Copy Ref'),
                  icon: <IconCopy className="w-4 h-4" />,
                  onClick: (transfer: Transfer) => navigator.clipboard.writeText(transfer.referenceNumber),
                },
              ]}
            />
          </div>
        ),
        size: 180,
      },
    ],
    [state.accounts, state.beneficiaries, handleDelete, handleDownloadPDF, handleArchive, handleView],
  )

  // ── Table instance ────────────────────────────────────────────────────────

  const { table } = useDataTable({
    data: state.transfers,
    columns,
    pageCount: Math.ceil(state.transfers.length / 10),
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: 'referenceNumber', desc: false }],
      columnPinning: { right: ['actions'] },
    },
  })

  // ── Summary stats ─────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const transfers = state.transfers
    const total = transfers.length
    const completed = transfers.filter((t) => t.status === 'completed').length
    const pending = transfers.filter((t) => t.status === 'pending').length
    const totalAmount = transfers.reduce((sum, t) => sum + (t.amount ?? 0), 0)
    const completedPct = Math.round((completed / (total || 1)) * 100)
    const pendingPct = Math.round((pending / (total || 1)) * 100)
    return { total, completed, pending, totalAmount, completedPct, pendingPct }
  }, [state.transfers])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AppLayout title={t('التحويلات', 'Transfers')}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="space-y-6 @container"
      >
        {/* ── Page header ───────────────────────────────────────────────── */}
        <motion.div variants={cardVariants} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              <img src="/assets/media/synex/send.png" alt="Send" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{t('التحويلات', 'Transfers')}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{t('إدارة وإنشاء التحويلات البنكية', 'Manage and create bank transfers')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <ExportButton table={table} filename="transfers" />
            <KeyboardShortcutsHelp />
            <Link to="/synex/transfers/new">
              <Button className="gap-2 rounded-xl shadow-sm">
                <IconPlus className="h-4 w-4" />
                {t('تحويل جديد', 'New Transfer')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ── Summary stats ─────────────────────────────────────────────── */}
        <motion.div variants={pageVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label={t('إجمالي التحويلات', 'Total Transfers')}
            value={stats.total.toString()}
          />
          <StatCard
            label={t('مكتملة', 'Completed')}
            value={stats.completed.toString()}
            subLabel={`${stats.completedPct}%`}
            accent="success"
          />
          <StatCard
            label={t('قيد الانتظار', 'Pending')}
            value={stats.pending.toString()}
            subLabel={`${stats.pendingPct}%`}
            accent="warning"
          />
          <StatCard
            label={t('المبلغ الكلي', 'Total Volume')}
            value={stats.totalAmount.toLocaleString()}
            subLabel="SAR"
          />
        </motion.div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <motion.div variants={cardVariants}>
          {isLoading ? (
            <DataTableSkeleton
              columnCount={9}
              rowCount={8}
              filterCount={3}
              withViewOptions
              withPagination
              cellWidths={['40px', '120px', '160px', '160px', '120px', '100px', '80px', '80px', '120px']}
            />
          ) : (
            <DataTable table={table} pageSizeOptions={[10, 20, 50, 100]}>
              <DataTableAdvancedToolbar table={table}>
                <DataTableFilterMenu
                  table={table}
                  filters={activeFilters}
                  onFiltersChange={setActiveFilters}
                  align="start"
                />
                <DataTableSortList table={table} align="start" />
                <RowGroupingButton
                  groupableColumns={GROUPABLE_COLUMNS}
                  activeGroup={activeGroup}
                  onGroupChange={setActiveGroup}
                />
                <BulkActions
                  table={table}
                  onDelete={handleBulkDelete}
                  onActivate={handleBulkActivate}
                  confirmDeleteMessage={t(
                    'هل أنت متأكد من حذف التحويلات المحددة؟',
                    'Delete selected transfers? This cannot be undone.',
                  )}
                  actionButtons={[
                    {
                      id: 'bulk-archive',
                      label: t('أرشفة', 'Archive'),
                      icon: <IconArchive className="h-4 w-4" />,
                      onClick: async (ids) => console.log('Archive:', ids),
                    },
                    {
                      id: 'bulk-send',
                      label: t('إرسال', 'Send'),
                      icon: <IconSend className="h-4 w-4" />,
                      onClick: async (ids) => console.log('Send:', ids),
                    },
                  ]}
                  getRowId={(row) => (row as Transfer).id}
                />
              </DataTableAdvancedToolbar>

              {/* Grouped view */}
              {activeGroup && groupedData && (
                <div className="rounded-xl border border-border/60 overflow-hidden">
                  {Array.from(groupedData.entries()).map(([groupValue, groupRows]) => (
                    <div key={groupValue}>
                      <GroupHeader
                        groupValue={groupValue}
                        count={groupRows.length}
                        isExpanded={expandedGroups.has(groupValue)}
                        onToggle={() => toggleGroup(groupValue)}
                      />
                      {expandedGroups.has(groupValue) && (
                        <div className="divide-y divide-border/40">
                          {groupRows.map((transfer) => (
                            <GroupedTransferRow
                              key={transfer.id}
                              transfer={transfer}
                              beneficiaries={state.beneficiaries}
                              onView={handleView}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </DataTable>
          )}
        </motion.div>
      </motion.div>

    </AppLayout>
  )
}

// (legacy RowDetailsSheet removed — clicking a row navigates to /synex/transfers/:id)
function _unused() { return null }

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, subLabel, accent,
}: {
  label: string
  value: string
  subLabel?: string
  accent?: 'success' | 'warning' | 'destructive'
}) {
  const accentStyles: Record<string, string> = {
    success: 'border-emerald-500/20 bg-emerald-500/5',
    warning: 'border-yellow-500/20 bg-yellow-500/5',
    destructive: 'border-destructive/20 bg-destructive/5',
  }
  const valueStyles: Record<string, string> = {
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    destructive: 'text-destructive',
  }

  return (
    <motion.div
      variants={cardVariants}
      className={`group relative overflow-hidden flex flex-col gap-1.5 rounded-2xl border bg-card p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${accent ? accentStyles[accent] : 'border-border/60'}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(ellipse at 0% 0%, hsl(var(--primary)/0.04) 0%, transparent 60%)' }}
      />
      <span className="relative text-xs font-medium text-muted-foreground truncate">{label}</span>
      <div className="relative flex items-baseline gap-1.5">
        <span className={`text-2xl font-bold tabular-nums tracking-tight leading-none ${accent ? valueStyles[accent] : ''}`}>
          {value}
        </span>
        {subLabel && <span className="text-xs font-semibold text-muted-foreground">{subLabel}</span>}
      </div>
    </motion.div>
  )
}

function GroupedTransferRow({
  transfer, beneficiaries, onView, onDelete,
}: {
  transfer: Transfer
  beneficiaries: any[]
  onView: (t: Transfer) => void
  onDelete: (id: string) => void
}) {
  const beneficiary = beneficiaries.find((b) => b.id === transfer.beneficiaryId)
  const cfg = STATUS_CONFIG[transfer.status]

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer"
      onClick={() => onView(transfer)}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={`inline-block size-2 rounded-full flex-shrink-0 ${cfg?.dot ?? 'bg-muted'}`} />
        <div className="min-w-0">
          <span className="block text-sm font-mono truncate">{transfer.referenceNumber}</span>
          <span className="block text-xs text-muted-foreground truncate">{beneficiary?.name ?? transfer.beneficiaryId}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <CurrencyAmount amount={transfer.amount} currency={transfer.currency} />
        <Badge variant="outline" className="font-mono text-xs rounded-lg">{transfer.currency}</Badge>
        <Button
          variant="ghost" size="sm"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
          onClick={(e) => { e.stopPropagation(); onDelete(transfer.id) }}
        >
          <IconTrash className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function TransferDetailContent({
  transfer, accounts, beneficiaries,
}: {
  transfer: Transfer
  accounts: any[]
  beneficiaries: any[]
}) {
  const account = accounts.find((a) => a.id === transfer.sourceAccountId)
  const beneficiary = beneficiaries.find((b) => b.id === transfer.beneficiaryId)
  const cfg = STATUS_CONFIG[transfer.status]

  return (
    <>
      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
        <span className={`inline-block size-2.5 rounded-full ${cfg?.dot ?? 'bg-muted'}`} />
        <StatusBadge status={transfer.status} showIcon />
      </div>

      <DetailSection title={t('بيانات التحويل', 'Transfer Info')}>
        <DetailItem
          label={t('رقم المرجع', 'Reference Number')}
          value={<span className="font-mono text-sm tracking-wider">{transfer.referenceNumber}</span>}
        />
        <DetailItem
          label={t('المبلغ', 'Amount')}
          value={<span className="text-lg font-semibold tabular-nums"><CurrencyAmount amount={transfer.amount} currency={transfer.currency} /></span>}
        />
        <DetailItem
          label={t('العملة', 'Currency')}
          value={<Badge variant="outline" className="font-mono text-xs font-semibold tracking-widest rounded-lg">{transfer.currency}</Badge>}
        />
        {transfer.createdAt && (
          <DetailItem label={t('تاريخ الإنشاء', 'Created At')} value={new Date(transfer.createdAt).toLocaleString()} />
        )}
      </DetailSection>

      <DetailSection title={t('الحساب المُرسِل', 'Source Account')} collapsible>
        <DetailItem label={t('البنك', 'Bank')} value={account?.bankName ?? transfer.sourceAccountId} />
        {account?.accountNumber && (
          <DetailItem
            label={t('رقم الحساب', 'Account Number')}
            value={<span className="font-mono text-sm">•••• {account.accountNumber.slice(-4)}</span>}
          />
        )}
      </DetailSection>

      <DetailSection title={t('المستفيد', 'Beneficiary')} collapsible>
        <DetailItem label={t('الاسم', 'Name')} value={beneficiary?.name ?? transfer.beneficiaryId} />
        {beneficiary?.bankName && <DetailItem label={t('البنك', 'Bank')} value={beneficiary.bankName} />}
        {beneficiary?.iban && (
          <DetailItem label="IBAN" value={<span className="font-mono text-sm tracking-wider">{beneficiary.iban}</span>} />
        )}
        <DetailItem label={t('الدولة', 'Country')} value={transfer.country} />
      </DetailSection>
    </>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusFilterVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'completed': return 'default'
    case 'rejected':
    case 'cancelled': return 'destructive'
    case 'draft':     return 'outline'
    default:          return 'secondary'
  }
}