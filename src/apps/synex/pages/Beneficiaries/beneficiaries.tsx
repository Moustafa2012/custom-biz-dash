import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { t } from '@/lib/translations'
import {
  IconUsers, IconPlus, IconBuildingBank, IconWorld,
  IconMail, IconPhone, IconRefresh, IconCircleCheck,
  IconArrowUpRight, IconArrowDownRight,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useSynex } from '../../store/synex-store'
import { StatusBadge } from '../../components/StatusBadge'
import type {
  ColumnDef, FilterFn, SortingState,
  ColumnFiltersState, VisibilityState, RowSelectionState,
} from '@tanstack/react-table'
import type { Beneficiary } from '../../data/mock'
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

const multiSelectFilterFn: FilterFn<Beneficiary> = (row, columnId, filterValues: string[]) => {
  if (!filterValues?.length) return true
  return filterValues.includes(String(row.getValue(columnId)))
}
multiSelectFilterFn.autoRemove = (val: string[]) => !val?.length

const textFilterFn: FilterFn<Beneficiary> = (row, columnId, filterValue: string) => {
  if (!filterValue) return true
  return String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase())
}
textFilterFn.autoRemove = (val: string) => !val

// ─── Country helpers ───────────────────────────────────────────────────────────

const countryNames: Record<string, { ar: string; en: string }> = {
  SA: { ar: 'السعودية', en: 'Saudi Arabia' },
  US: { ar: 'أمريكا', en: 'USA' },
  GB: { ar: 'بريطانيا', en: 'UK' },
  AE: { ar: 'الإمارات', en: 'UAE' },
  IN: { ar: 'الهند', en: 'India' },
  CN: { ar: 'الصين', en: 'China' },
  EU: { ar: 'أوروبا', en: 'Europe' },
}

const countryLabel = (code: string) =>
  countryNames[code] ? t(countryNames[code].ar, countryNames[code].en) : code

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

// ─── BeneficiariesPage ────────────────────────────────────────────────────────

export default function BeneficiariesPage() {
  const navigate = useNavigate()
  const { state, loadFromStorage, deleteBeneficiary, updateBeneficiary } = useSynex()

  const [data, setData] = useState<Beneficiary[]>(state.beneficiaries)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | undefined>()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadFromStorage() }, [loadFromStorage])
  useEffect(() => { setData(state.beneficiaries) }, [state.beneficiaries])

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      toast.success(t('تم تحديث ترتيب المستفيدين', 'Beneficiary order updated'))
    }
  }

  const handleDelete = useCallback(
    (id: string) => {
      if (confirm(t('هل أنت متأكد من حذف هذا المستفيد؟', 'Are you sure you want to delete this beneficiary?'))) {
        deleteBeneficiary(id)
      }
    },
    [deleteBeneficiary],
  )

  const handleView = useCallback((beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary)
    setDetailsOpen(true)
  }, [])

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      for (const id of ids) deleteBeneficiary(id)
      toast.success(t(`تم حذف ${ids.length} مستفيد`, `Deleted ${ids.length} beneficiaries`))
    },
    [deleteBeneficiary],
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
    const total = state.beneficiaries.length
    const active = state.beneficiaries.filter((b) => b.status === 'active').length
    const countries = new Set(state.beneficiaries.map((b) => b.country)).size
    const banks = new Set(state.beneficiaries.map((b) => b.bankName)).size
    const activePct = Math.round((active / (total || 1)) * 100)
    return { total, active, countries, banks, activePct }
  }, [state.beneficiaries])

  // ─── Columns ─────────────────────────────────────────────────────────────────

  const uniqueCountries = useMemo(
    () => [...new Set(state.beneficiaries.map((b) => b.country))],
    [state.beneficiaries],
  )

  const columns = useMemo<ColumnDef<Beneficiary>[]>(
    () => [
      {
        id: 'select',
        size: 48, minSize: 48, maxSize: 48,
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
      },
      {
        accessorKey: 'name',
        size: 260, minSize: 260,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('الاسم', 'Name')} />,
        cell: ({ row }) => {
          const initials = row.original.name.slice(0, 2).toUpperCase()
          return (
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-muted font-bold text-xs text-muted-foreground shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate leading-tight text-start">{row.original.name}</p>
                {row.original.companyName && (
                  <p className="text-xs text-muted-foreground truncate">{row.original.companyName}</p>
                )}
              </div>
            </div>
          )
        },
        filterFn: textFilterFn,
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'bankName',
        size: 200, minSize: 200,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('البنك', 'Bank')} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <IconBuildingBank className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm truncate">{row.original.bankName}</span>
          </div>
        ),
        filterFn: textFilterFn,
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'country',
        size: 150, minSize: 150,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('الدولة', 'Country')} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <IconWorld className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-sm">{countryLabel(row.original.country)}</span>
          </div>
        ),
        filterFn: multiSelectFilterFn,
        enableSorting: true, enableColumnFilter: true,
      },
      {
        accessorKey: 'currency',
        size: 100, minSize: 100,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('العملة', 'Currency')} />,
        cell: ({ row }) => {
          const currency = row.original.currency
          return (
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                {currency.slice(0, 1)}
              </span>
              <span className="text-sm font-semibold" style={{ direction: 'ltr', unicodeBidi: 'embed' }}>{currency}</span>
            </div>
          )
        },
        filterFn: multiSelectFilterFn,
        enableSorting: true, enableColumnFilter: true,
      },
      {
        id: 'contact',
        size: 200, minSize: 200,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('التواصل', 'Contact')} />,
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            {row.original.email && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="flex h-4 w-4 items-center justify-center rounded bg-muted shrink-0">
                  <IconMail className="h-2.5 w-2.5" />
                </div>
                <span className="truncate max-w-[160px]">{row.original.email}</span>
              </div>
            )}
            {row.original.phone && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="flex h-4 w-4 items-center justify-center rounded bg-muted shrink-0">
                  <IconPhone className="h-2.5 w-2.5" />
                </div>
                <span>{row.original.phone}</span>
              </div>
            )}
            {!row.original.email && !row.original.phone && (
              <span className="text-xs text-muted-foreground/50">—</span>
            )}
          </div>
        ),
        enableSorting: false, enableColumnFilter: false,
      },
      {
        accessorKey: 'status',
        size: 130, minSize: 130,
        header: ({ column }) => <DataTableColumnHeader column={column} label={t('الحالة', 'Status')} />,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        filterFn: multiSelectFilterFn,
        enableSorting: true, enableColumnFilter: true,
      },
      {
        id: 'actions',
        size: 100, minSize: 100, maxSize: 100,
        enableHiding: false, enableSorting: false, enableColumnFilter: false,
        header: () => (
          <span className="flex w-full items-center text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('إجراءات', 'Actions')}
          </span>
        ),
        cell: ({ row }) => (
          <div className="flex justify-end">
            <TableActions
              data={row.original}
              onView={handleView}
              onEdit={(b) => navigate(`/synex/beneficiaries/${b.id}/edit`)}
              onDelete={(b) => handleDelete(b.id)}
              confirmDelete
              deleteMessage={t(
                'هل أنت متأكد من حذف هذا المستفيد؟ لا يمكن التراجع عن هذا الإجراء.',
                'Are you sure you want to delete this beneficiary? This action cannot be undone.',
              )}
              isRTL={document.documentElement.dir === 'rtl'}
            />
          </div>
        ),
      },
    ],
    [uniqueCountries, handleView, handleDelete, navigate],
  )

  // ─── Table instance ────────────────────────────────────────────────────────

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
      sorting: [{ id: 'name', desc: false }],
    },
  })

  useTableKeyboardShortcuts({
    table,
    onSearch: () => searchInputRef.current?.focus(),
    onRefresh: handleRefresh,
    onDelete: () => {
      const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id)
      if (ids.length > 0) {
        if (confirm(t(`هل أنت متأكد من حذف ${ids.length} مستفيد؟`, `Delete ${ids.length} beneficiaries?`))) {
          handleBulkDelete(ids)
          table.toggleAllRowsSelected(false)
        }
      }
    },
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <AppLayout title={t('المستفيدون', 'Beneficiaries')}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <TableHeaderSection
            title={t('المستفيدون', 'Beneficiaries')}
            description={t('إدارة المستفيدين والجهات المستفيدة', 'Manage beneficiaries and recipient entities')}
          />
          <div className="flex items-center gap-2 shrink-0 sm:self-start">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-1.5 rounded-xl">
              <IconRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('تحديث', 'Refresh')}
            </Button>
            <Link to="/synex/beneficiaries/new">
              <Button size="sm" className="gap-1.5 rounded-xl shadow-sm">
                <IconPlus className="h-4 w-4" />
                {t('إضافة مستفيد', 'Add Beneficiary')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={pageVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label={t('إجمالي المستفيدين', 'Total Beneficiaries')}
            value={stats.total}
            sub={t('مستفيد مسجل', 'registered beneficiaries')}
            trend="up"
            trendValue="+12%"
            icon={<img src="/assets/media/synex/beneficiary.png" alt="Beneficiary" className="h-5 w-5" />}
          />
          <StatCard
            label={t('المستفيدين النشطون', 'Active Beneficiaries')}
            value={`${stats.active} / ${stats.total}`}
            sub={t('مستفيد مفعّل', 'beneficiaries active')}
            trend={stats.active === stats.total ? 'up' : 'neutral'}
            trendValue={`${stats.activePct}%`}
            icon={<IconCircleCheck className="h-5 w-5" />}
          />
          <StatCard
            label={t('الدول المدعومة', 'Countries')}
            value={stats.countries}
            sub={t('دولة مختلفة', 'different countries')}
            icon={<IconWorld className="h-5 w-5" />}
          />
          <StatCard
            label={t('البنوك', 'Banks')}
            value={stats.banks}
            sub={t('بنك مختلف', 'different banks')}
            icon={<IconBuildingBank className="h-5 w-5" />}
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
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 overflow-hidden">
                  <img src="/assets/media/synex/beneficiary.png" alt="Beneficiary" className="h-5 w-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t('قائمة المستفيدين', 'Beneficiary List')}</p>
                  <p className="text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length}{' '}{t('مستفيد', 'beneficiaries')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DataTableToolbar table={table} />
                <ExportButton table={table} filename="beneficiaries-export" />
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
                    onActivate={(ids) => {
                      ids.forEach((id) => updateBeneficiary(id, { status: 'active' }))
                      toast.success(t(`تم تفعيل ${ids.length} مستفيد`, `Activated ${ids.length} beneficiaries`))
                    }}
                    onDeactivate={(ids) => {
                      ids.forEach((id) => updateBeneficiary(id, { status: 'inactive' }))
                      toast.success(t(`تم تعطيل ${ids.length} مستفيد`, `Deactivated ${ids.length} beneficiaries`))
                    }}
                    onDelete={handleBulkDelete}
                    confirmDeleteMessage={t(
                      'سيؤدي هذا إلى حذف المستفيدين المختارة نهائياً.',
                      'This will permanently delete the selected beneficiaries.'
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
                <Table className="w-full border-collapse" style={{ tableLayout: 'fixed', minWidth: 1300 }}>
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
                                <IconUsers className="h-7 w-7 text-muted-foreground/40" />
                              </div>
                              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted border border-border">
                                <IconPlus className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-foreground">{t('لا يوجد مستفيدين', 'No beneficiaries found')}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t('حاول تعديل الفلاتر أو إضافة مستفيد جديد', 'Try adjusting filters or adding a new beneficiary')}</p>
                            </div>
                            <Link to="/synex/beneficiaries/new">
                              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
                                <IconPlus className="h-3.5 w-3.5" />
                                {t('إضافة مستفيد', 'Add Beneficiary')}
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
        data={selectedBeneficiary}
        title={t('تفاصيل المستفيد', 'Beneficiary Details')}
        description={selectedBeneficiary?.name}
        mode="view"
        allowEdit={false}
        allowDelete
        onDelete={async (b) => {
          if (b) { handleDelete(b.id); setDetailsOpen(false) }
        }}
        deleteButtonText={t('حذف المستفيد', 'Delete Beneficiary')}
        renderContent={(b) => {
          if (!b) return null
          return (
            <div className="space-y-6">
              <DetailSection title={t('المعلومات الشخصية', 'Personal Information')}>
                <DetailItem label={t('الاسم', 'Name')} value={b.name} />
                {b.companyName && <DetailItem label={t('الشركة', 'Company')} value={b.companyName} />}
                <DetailItem label={t('الحالة', 'Status')} value={<StatusBadge status={b.status} />} />
              </DetailSection>
              <DetailSection title={t('المعلومات المصرفية', 'Banking Information')}>
                <DetailItem label={t('البنك', 'Bank')} value={b.bankName} />
                <DetailItem label={t('الدولة', 'Country')} value={countryLabel(b.country)} />
                <DetailItem label={t('العملة', 'Currency')} value={b.currency} />
              </DetailSection>
              {(b.email || b.phone) && (
                <DetailSection title={t('معلومات التواصل', 'Contact Information')}>
                  {b.email && <DetailItem label={t('البريد', 'Email')} value={b.email} />}
                  {b.phone && <DetailItem label={t('الهاتف', 'Phone')} value={b.phone} />}
                </DetailSection>
              )}
            </div>
          )
        }}
        width="w-full sm:max-w-lg"
      />
    </AppLayout>
  )
}