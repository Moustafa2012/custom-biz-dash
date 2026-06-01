import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { t } from '@/lib/translations'
import {
  IconBook, IconPlus, IconArrowUp, IconArrowDown,
  IconArrowsExchange, IconCoin, IconAdjustments, IconRefresh,
  IconArrowUpRight, IconArrowDownRight,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useSynex } from '../../store/synex-store'
import { CurrencyAmount } from '../../components/CurrencyAmount'
import { StatusBadge } from '../../components/StatusBadge'
import type {
  ColumnDef, FilterFn, SortingState,
  ColumnFiltersState, VisibilityState, RowSelectionState,
} from '@tanstack/react-table'
import type { JournalEntry } from '../../data/mock'
import {
  useReactTable, getCoreRowModel, getFilteredRowModel,
  getPaginationRowModel, getSortedRowModel, flexRender,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DataTableToolbar, DataTablePagination, TableActions, BulkActions, ExportButton,
  RowDetailsSheet, DetailItem, DetailSection, DraggableRow, DataTableColumnHeader,
  useTableKeyboardShortcuts, TableHeaderSection,
} from '@/components/ui/data-table'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import {
  type DragEndEvent, DndContext, closestCenter,
  KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

// ─── Filter functions ─────────────────────────────────────────────────────────

const multiSelectFilterFn: FilterFn<JournalEntry> = (row, columnId, filterValues: string[]) => {
  if (!filterValues?.length) return true
  return filterValues.includes(String(row.getValue(columnId)))
}
multiSelectFilterFn.autoRemove = (val: string[]) => !val?.length

const textFilterFn: FilterFn<JournalEntry> = (row, columnId, filterValue: string) => {
  if (!filterValue) return true
  return String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase())
}
textFilterFn.autoRemove = (val: string) => !val

// ─── Shared animation variants ────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
}

const tableVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.4 } },
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: React.ReactNode
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon: React.ReactNode
}

const StatCard = ({ label, value, sub, trend, trendValue, icon }: StatCardProps) => (
  <motion.div
    variants={cardVariants}
    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
  >
    <div
      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: 'radial-gradient(ellipse at 0% 0%, hsl(var(--primary)/0.06) 0%, transparent 60%)' }}
    />
    <div className="relative flex items-start justify-between gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-background shadow-sm text-primary shrink-0 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
        {icon}
      </div>
      {trend && trendValue && (
        <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
          trend === 'up'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : trend === 'down'
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted text-muted-foreground'
        }`}>
          {trend === 'up' ? <IconArrowUpRight className="h-3 w-3" /> : trend === 'down' ? <IconArrowDownRight className="h-3 w-3" /> : null}
          {trendValue}
        </span>
      )}
    </div>
    <div className="relative">
      <p className="text-[1.6rem] font-bold tracking-tight text-foreground leading-none tabular-nums">{value}</p>
      <p className="text-sm font-medium text-muted-foreground mt-1.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
)

// ─── Type config ──────────────────────────────────────────────────────────────

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: { ar: string; en: string } }> = {
  settlement:         { icon: IconArrowsExchange, color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-500/10',   label: { ar: 'تسوية',         en: 'Settlement'        } },
  bank_fee:           { icon: IconCoin,           color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10', label: { ar: 'رسوم بنكية',    en: 'Bank Fee'          } },
  balance_correction: { icon: IconAdjustments,    color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', label: { ar: 'تصحيح رصيد',   en: 'Balance Correction'} },
  deposit:            { icon: IconArrowDown,      color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', label: { ar: 'إيداع',      en: 'Deposit'           } },
  withdrawal:         { icon: IconArrowUp,        color: 'text-red-600 dark:text-red-400',     bg: 'bg-red-500/10',    label: { ar: 'سحب',           en: 'Withdrawal'        } },
  internal_transfer:  { icon: IconArrowsExchange, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', label: { ar: 'تحويل داخلي', en: 'Internal Transfer' } },
}

// ─── JournalEntriesPage ───────────────────────────────────────────────────────

export default function JournalEntriesPage() {
  const navigate = useNavigate()
  const { state, loadFromStorage, deleteJournalEntry } = useSynex()

  const [data, setData] = useState<JournalEntry[]>(state.journalEntries)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadFromStorage() }, [loadFromStorage])
  useEffect(() => { setData(state.journalEntries) }, [state.journalEntries])

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      toast.success(t('تم تحديث ترتيب القيود', 'Entry order updated'))
    }
  }

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm(t('هل أنت متأكد من حذف هذا القيد؟', 'Are you sure you want to delete this entry?'))) {
        deleteJournalEntry(id)
        toast.success(t('تم حذف القيد بنجاح', 'Entry deleted successfully'))
      }
    },
    [deleteJournalEntry],
  )

  const handleView = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry)
    setDetailsOpen(true)
  }, [])

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      for (const id of ids) deleteJournalEntry(id)
      toast.success(t(`تم حذف ${ids.length} قيد`, `Deleted ${ids.length} entries`))
    },
    [deleteJournalEntry],
  )

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await new Promise((r) => setTimeout(r, 700))
    loadFromStorage()
    setIsRefreshing(false)
    toast.success(t('تم تحديث البيانات', 'Data refreshed'))
  }, [loadFromStorage])

  // ─── Stats ────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const entries = state.journalEntries
    const total = entries.length
    const totalDeposits = entries.filter((e) => e.transactionType === 'deposit').reduce((s, e) => s + e.amount, 0)
    const totalWithdrawals = entries.filter((e) => e.transactionType === 'withdrawal').reduce((s, e) => s + e.amount, 0)
    const totalFees = entries.filter((e) => e.transactionType === 'bank_fee').reduce((s, e) => s + e.amount, 0)
    return { total, totalDeposits, totalWithdrawals, totalFees }
  }, [state.journalEntries])

  // ─── Columns ─────────────────────────────────────────────────────────────────

  const columns = useMemo<ColumnDef<JournalEntry>[]>(
    () => [
      {
        id: 'select',
        size: 48, minSize: 48, maxSize: 48,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
            aria-label="Select row"
          />
        ),
        enableSorting: false, enableHiding: false,
      },
      {
        accessorKey: 'entryNumber',
        size: 140, minSize: 140,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('رقم القيد', 'Entry #')} />,
        cell: ({ row }) => (
          <span className="font-mono text-xs tracking-wider bg-muted/50 px-2 py-1 rounded-lg border border-border/50">
            {row.original.entryNumber}
          </span>
        ),
        filterFn: textFilterFn,
        meta: {
          label: t('رقم القيد', 'Entry #'),
          variant: 'text' as const,
          placeholder: t('بحث برقم القيد...', 'Search entry #...'),
        },
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'transactionType',
        size: 180, minSize: 180,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('النوع', 'Type')} />,
        cell: ({ row }) => {
          const cfg = typeConfig[row.original.transactionType]
          const Icon = cfg?.icon ?? IconBook
          return (
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${cfg?.bg ?? 'bg-muted'}`}>
                <Icon className={`h-3.5 w-3.5 ${cfg?.color ?? 'text-muted-foreground'}`} />
              </div>
              <StatusBadge status={row.original.transactionType} />
            </div>
          )
        },
        filterFn: multiSelectFilterFn,
        meta: {
          label: t('النوع', 'Type'),
          variant: 'multiSelect' as const,
          options: Object.entries(typeConfig).map(([key, cfg]) => ({
            value: key,
            label: t(cfg.label.ar, cfg.label.en),
          })),
        },
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'accountId',
        size: 200, minSize: 200,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('الحساب', 'Account')} />,
        cell: ({ row }) => {
          const account = state.accounts.find((a) => a.id === row.original.accountId)
          return <span className="text-sm">{account?.bankName ?? row.original.accountId}</span>
        },
        filterFn: multiSelectFilterFn,
        meta: {
          label: t('الحساب', 'Account'),
          variant: 'multiSelect' as const,
          options: state.accounts.map((a) => ({ value: a.id, label: a.bankName })),
        },
        enableSorting: false, enableColumnFilter: true,
      },
      {
        accessorKey: 'description',
        size: 250, minSize: 250,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('الوصف', 'Description')} />,
        cell: ({ row }) => (
          <span className="text-sm max-w-[200px] truncate block text-muted-foreground">{row.original.description}</span>
        ),
        filterFn: textFilterFn,
        meta: {
          label: t('الوصف', 'Description'),
          variant: 'text' as const,
          placeholder: t('بحث في الوصف...', 'Search description...'),
        },
        enableSorting: false, enableColumnFilter: true,
      },
      {
        accessorKey: 'amount',
        size: 150, minSize: 150,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('المبلغ', 'Amount')} />,
        cell: ({ row }) => (
          <div className="font-semibold tabular-nums">
            <CurrencyAmount amount={row.original.amount} currency={row.original.currency} />
          </div>
        ),
        meta: { label: t('المبلغ', 'Amount') },
        enableSorting: true, enableColumnFilter: false,
      },
      {
        accessorKey: 'date',
        size: 140, minSize: 140,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('التاريخ', 'Date')} />,
        cell: ({ row }) => (
          <div className="flex flex-col tabular-nums">
            <span className="text-sm">{new Date(row.original.date).toLocaleDateString()}</span>
          </div>
        ),
        meta: { label: t('التاريخ', 'Date') },
        enableSorting: true, enableColumnFilter: false,
      },
      {
        accessorKey: 'createdBy',
        size: 160, minSize: 160,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('أنشأ بواسطة', 'Created By')} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border border-border/60 text-[10px] font-bold text-muted-foreground shrink-0">
              {row.original.createdBy.slice(0, 1).toUpperCase()}
            </div>
            <span className="text-sm text-muted-foreground truncate">{row.original.createdBy}</span>
          </div>
        ),
        meta: { label: t('أنشأ بواسطة', 'Created By') },
        enableSorting: true, enableColumnFilter: false,
      },
      {
        id: 'actions',
        size: 100, minSize: 100, maxSize: 100,
        header: () => (
          <span className="flex w-full items-center text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('إجراءات', 'Actions')}
          </span>
        ),
        cell: ({ row }) => (
          <TableActions
            data={row.original}
            onView={handleView}
            onEdit={(e) => navigate(`/synex/journal-entries/${e.id}/edit`)}
            onDelete={(e) => handleDelete(e.id)}
            confirmDelete
            deleteMessage={t('هل أنت متأكد من حذف هذا القيد؟', 'Are you sure you want to delete this entry?')}
            isRTL={document.documentElement.dir === 'rtl'}
          />
        ),
        enableSorting: false, enableHiding: false,
      },
    ],
    [state.accounts, handleView, navigate, handleDelete],
  )

  const table = useReactTable({
    data, columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    enableRowSelection: true,
    columnResizeMode: 'onChange',
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: 'date', desc: true }],
    },
  })

  useTableKeyboardShortcuts({
    table,
    onSearch: () => searchInputRef.current?.focus(),
    onRefresh: handleRefresh,
    onDelete: () => {
      const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id)
      if (ids.length > 0) {
        if (confirm(t(`هل أنت متأكد من حذف ${ids.length} قيد؟`, `Delete ${ids.length} entries?`))) {
          handleBulkDelete(ids)
          table.toggleAllRowsSelected(false)
        }
      }
    },
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <AppLayout title={t('القيود اليومية', 'Journal Entries')}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <TableHeaderSection
            title={t('القيود اليومية', 'Journal Entries')}
            description={t('إدارة القيود المحاسبية اليومية', 'Manage daily accounting entries')}
          />
          <div className="flex items-center gap-2 shrink-0 sm:self-start">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-1.5 rounded-xl">
              <IconRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('تحديث', 'Refresh')}
            </Button>
            <Link to="/synex/journal-entries/new">
              <Button size="sm" className="gap-1.5 rounded-xl shadow-sm">
                <IconPlus className="h-4 w-4" />
                {t('قيد جديد', 'New Entry')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={pageVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label={t('إجمالي القيود', 'Total Entries')}
            value={stats.total}
            sub={t('قيد مسجل', 'registered entries')}
            trend="up"
            trendValue="+8%"
            icon={<IconBook className="h-5 w-5" />}
          />
          <StatCard
            label={t('الإيداعات', 'Deposits')}
            value={<CurrencyAmount amount={stats.totalDeposits} currency="SAR" />}
            sub={t('إجمالي الإيداعات', 'total deposits')}
            trend="up"
            trendValue="+12%"
            icon={<IconArrowDown className="h-5 w-5" />}
          />
          <StatCard
            label={t('السحوبات', 'Withdrawals')}
            value={<CurrencyAmount amount={stats.totalWithdrawals} currency="SAR" />}
            sub={t('إجمالي السحوبات', 'total withdrawals')}
            trend="down"
            trendValue="-3%"
            icon={<IconArrowUp className="h-5 w-5" />}
          />
          <StatCard
            label={t('الرسوم البنكية', 'Bank Fees')}
            value={<CurrencyAmount amount={stats.totalFees} currency="USD" />}
            sub={t('إجمالي الرسوم', 'total fees')}
            icon={<IconCoin className="h-5 w-5" />}
          />
        </motion.div>

        {/* Table Card */}
        <motion.div
          variants={tableVariants}
          className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden"
        >
          {/* Toolbar */}
          <div className="px-5 pt-5 pb-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <IconBook className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t('قائمة القيود', 'Entry List')}</p>
                  <p className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length}{' '}{t('قيد', 'entries')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DataTableToolbar table={table} />
                <ExportButton table={table} filename="journal-entries-export" />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="border-b border-border/60 bg-primary/5 px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    {selectedCount}
                  </div>
                  <span className="text-sm font-medium text-foreground">{t('محدد', 'selected')}</span>
                  <BulkActions
                    table={table}
                    onDelete={handleBulkDelete}
                    confirmDeleteMessage={t(
                      'سيؤدي هذا إلى حذف القيود المختارة نهائياً.',
                      'This will permanently delete the selected entries.'
                    )}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          <div className="overflow-hidden">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="overflow-x-auto">
                <Table className="w-full border-collapse" style={{ tableLayout: 'fixed', minWidth: 1400 }}>
                  <TableHeader className="bg-muted/30 sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="border-b border-border/60 hover:bg-transparent">
                        <TableHead className="p-0 bg-muted/30" style={{ width: 42, minWidth: 42, maxWidth: 42 }} />
                        {headerGroup.headers.map((header) => {
                          const size = header.getSize()
                          return (
                            <TableHead
                              key={header.id}
                              className="h-12 px-3 align-middle bg-muted/30 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                              style={{ width: size, minWidth: size, maxWidth: size }}
                            >
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      <SortableContext
                        items={table.getRowModel().rows.map((r) => r.original.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {table.getRowModel().rows.map((row) => (
                          <DraggableRow
                            key={row.id}
                            id={row.original.id}
                            className={`group border-b border-border/40 transition-all duration-150 ${
                              row.getIsSelected() ? 'bg-primary/5' : 'hover:bg-muted/40'
                            }`}
                          >
                            {row.getVisibleCells().map((cell) => {
                              const size = cell.column.getSize()
                              return (
                                <TableCell
                                  key={cell.id}
                                  className="px-3 py-3 align-middle"
                                  style={{ width: size, minWidth: size, maxWidth: size }}
                                >
                                  <div className="flex items-center w-full overflow-hidden">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </div>
                                </TableCell>
                              )
                            })}
                          </DraggableRow>
                        ))}
                      </SortableContext>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length + 1} className="h-52">
                          <div className="flex flex-col items-center justify-center gap-4 text-center">
                            <div className="relative">
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
                                <IconBook className="h-7 w-7 text-muted-foreground/40" />
                              </div>
                              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted border border-border">
                                <IconPlus className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-foreground">{t('لا توجد قيود', 'No entries found')}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t('حاول تعديل الفلاتر أو إضافة قيد جديد', 'Try adjusting filters or adding a new entry')}</p>
                            </div>
                            <Link to="/synex/journal-entries/new">
                              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
                                <IconPlus className="h-3.5 w-3.5" />
                                {t('قيد جديد', 'New Entry')}
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </DndContext>
          </div>

          {/* Pagination */}
          <div className="border-t border-border/60 bg-muted/10 px-4 py-3">
            <DataTablePagination table={table} />
          </div>
        </motion.div>
      </motion.div>

      {/* Details sheet */}
      <RowDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        data={selectedEntry}
        title={t('تفاصيل القيد', 'Entry Details')}
        description={selectedEntry?.entryNumber}
        mode="view"
        allowEdit={false}
        allowDelete={false}
        renderContent={(entry) => {
          if (!entry) return null
          const account = state.accounts.find((a) => a.id === entry.accountId)
          const cfg = typeConfig[entry.transactionType]
          const Icon = cfg?.icon ?? IconBook
          return (
            <div className="space-y-6">
              {/* Type banner */}
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${cfg?.bg ?? 'bg-muted'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-background/50 shrink-0`}>
                  <Icon className={`h-4 w-4 ${cfg?.color ?? 'text-muted-foreground'}`} />
                </div>
                <StatusBadge status={entry.transactionType} />
              </div>

              <DetailSection title={t('معلومات القيد', 'Entry Information')}>
                <DetailItem label={t('رقم القيد', 'Entry #')} value={entry.entryNumber} />
                <DetailItem label={t('النوع', 'Type')} value={<StatusBadge status={entry.transactionType} />} />
                <DetailItem label={t('الوصف', 'Description')} value={entry.description} />
              </DetailSection>
              <DetailSection title={t('التفاصيل المالية', 'Financial Details')}>
                <DetailItem label={t('الحساب', 'Account')} value={account?.bankName ?? entry.accountId} />
                <DetailItem
                  label={t('المبلغ', 'Amount')}
                  value={<CurrencyAmount amount={entry.amount} currency={entry.currency} />}
                />
                <DetailItem label={t('التاريخ', 'Date')} value={new Date(entry.date).toLocaleDateString()} />
              </DetailSection>
              <DetailSection title={t('معلومات أخرى', 'Other Information')}>
                <DetailItem label={t('أنشأ بواسطة', 'Created By')} value={entry.createdBy} />
              </DetailSection>
            </div>
          )
        }}
        width="w-full sm:max-w-lg"
      />
    </AppLayout>
  )
}