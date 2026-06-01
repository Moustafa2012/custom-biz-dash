import { useState, useMemo, useRef, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableToolbar } from '@/components/table/DataTableToolbar';
import { DataTablePagination } from '@/components/table/DataTablePagination';
import { TableActions } from '@/components/table/TableActions';
import { BulkActions } from '@/components/table/BulkActions';
import { RowDetailsSheet } from '@/components/table/RowDetailsSheet';
import { DraggableRow } from '@/components/table/DraggableRow';
import { CopyButton } from '@/components/table/CopyButton';
import { KeyboardShortcutsHelp } from '@/components/table/KeyboardShortcutsHelp';
import { TableHeaderSection } from '@/components/table/TableHeader';
import { FeatureCards } from '@/components/table/FeatureCards';
import { UserDetailsContent } from '@/components/table/UserDetailsContent';
import { ExportButton } from '@/components/table/ExportButton';
import { SavedViews, type SavedView } from '@/components/table/SavedViews';
import { createUserColumns } from '@/components/table/columns/userColumns';
import { useTableKeyboardShortcuts } from '@/hooks/useTableKeyboardShortcuts';
import { User as UserIcon } from 'lucide-react';
import { mockUsers, type User } from '@/lib/mockData';
import type { FilterGroup } from '@/types/filter';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const FEATURES = [
  { title: 'Export Data', desc: 'CSV, JSON, Excel export', icon: '📥' },
  { title: 'Saved Views', desc: 'Save & restore configs', icon: '💾' },
  { title: 'Advanced Filters', desc: 'Nested AND/OR logic', icon: '🔍' },
  { title: 'Keyboard Shortcuts', desc: 'Fast navigation', icon: '⌨️' },
  { title: 'Drag & Drop', desc: 'Reorder rows easily', icon: '🔄' },
  { title: 'Bulk Actions', desc: 'Multi-row operations', icon: '⚡' },
];

const TableDemo = () => {
  const [data, setData] = useState<User[]>(mockUsers);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<FilterGroup[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const enableCellCopy = true;
  const enableRowCopy = true;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      toast.success('Row order updated');
    }
  };

  const handleApplyView = useCallback((view: SavedView) => {
    setSorting(view.sorting);
    setColumnFilters(view.columnFilters);
    setColumnVisibility(view.columnVisibility);
    setGlobalFilter(view.globalFilter);
  }, []);

  const { columns: baseColumns } = useMemo(() => createUserColumns(), []);

  const columns = useMemo(() => [
    ...baseColumns,
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }: { row: any }) => {
        const user = row.original;
        return (
          <TableActions
            data={user}
            onView={(user) => { setSelectedUser(user); setSheetOpen(true); }}
            onEdit={(user) => { setSelectedUser(user); setSheetOpen(true); toast.info('Edit mode activated'); }}
            onDelete={(user) => { setData(prev => prev.filter(u => u.id !== user.id)); toast.success('User deleted'); }}
            confirmDelete={true}
            deleteMessage={`Delete ${user.name}?`}
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ], [baseColumns]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useTableKeyboardShortcuts({
    table,
    onSearch: () => searchInputRef.current?.focus(),
    onRefresh: () => { setData([...mockUsers]); toast.success('Data refreshed'); },
    onExport: () => toast.success('Export triggered'),
    onDelete: () => {
      const selectedIds = table.getFilteredSelectedRowModel().rows.map(r => r.original.id);
      if (selectedIds.length > 0) {
        setData(prev => prev.filter(u => !selectedIds.includes(u.id)));
        table.toggleAllRowsSelected(false);
        toast.success(`Deleted ${selectedIds.length} users`);
      }
    },
  });

  const formatRowForCopy = (user: User) => `${user.name}\t${user.email}\t${user.role}\t${user.status}\t${user.department}`;

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-7xl mx-auto space-y-6">
        <TableHeaderSection title="Advanced Data Table" description="Export, saved views, filtering, keyboard shortcuts, and more." />
        <FeatureCards features={FEATURES} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <KeyboardShortcutsHelp />
              <div className="flex items-center gap-2 flex-wrap">
                <SavedViews table={table} sorting={sorting} columnFilters={columnFilters} columnVisibility={columnVisibility} globalFilter={globalFilter} onApplyView={handleApplyView} />
                <ExportButton table={table} filename="users-export" />
              </div>
            </div>
            <DataTableToolbar
              table={table}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              onRefresh={() => { setData([...mockUsers]); toast.success('Data refreshed'); }}
              columnFilters={[
                { id: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'pending', label: 'Pending' }] },
                { id: 'role', label: 'Role', type: 'select', options: [{ value: 'Admin', label: 'Admin' }, { value: 'Manager', label: 'Manager' }, { value: 'User', label: 'User' }] },
                { id: 'department', label: 'Department', type: 'text', placeholder: 'Filter department...' },
              ]}
              filterValues={{}}
              onFilterChange={(filterId, value) => {
                if (value === 'all' || value === '') {
                  setColumnFilters(prev => prev.filter(f => f.id !== filterId));
                } else {
                  setColumnFilters(prev => [...prev.filter(f => f.id !== filterId), { id: filterId, value }]);
                }
              }}
              onAdvancedFilterApply={(groups) => { setAdvancedFilters(groups); toast.success('Filters applied'); }}
              advancedFilterGroups={advancedFilters}
              showPagination={false}
            />
          </div>

          <AnimatePresence>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-5 py-4">
                <BulkActions
                  table={table}
                  onActivate={(ids) => { setData(data.map(u => ids.includes(u.id) ? { ...u, status: 'active' } : u)); toast.success(`Activated ${ids.length} users`); }}
                  onDeactivate={(ids) => { setData(data.map(u => ids.includes(u.id) ? { ...u, status: 'inactive' } : u)); toast.success(`Deactivated ${ids.length} users`); }}
                  onDelete={(ids) => { setData(data.filter(u => !ids.includes(u.id))); toast.success(`Deleted ${ids.length} users`); }}
                  confirmDeleteMessage="This will permanently delete the selected users."
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="overflow-x-auto">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <Table>
                <TableHeader className="bg-table-header">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-table-border">
                      <TableHead className="w-[40px] bg-table-header" />
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold text-xs uppercase tracking-wider text-muted-foreground bg-table-header">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                      {enableRowCopy && <TableHead className="w-[50px] bg-table-header" />}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <SortableContext items={table.getRowModel().rows.map((row) => row.original.id)} strategy={verticalListSortingStrategy}>
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} id={row.original.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className={`group py-3 transition-colors ${row.getIsSelected() ? 'bg-table-row-selected' : ''}`}>
                              <div className="flex items-center gap-1">
                                <div className="flex-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                                {enableCellCopy && cell.column.id !== 'select' && cell.column.id !== 'actions' && <CopyButton value={String(cell.getValue() ?? '')} type="cell" />}
                              </div>
                            </TableCell>
                          ))}
                          {enableRowCopy && <TableCell className="group py-3"><CopyButton value={formatRowForCopy(row.original)} type="row" /></TableCell>}
                        </DraggableRow>
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"><UserIcon className="h-6 w-6" /></div>
                          <div><p className="font-medium">No users found</p><p className="text-sm">Try adjusting your filters</p></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>

          <div className="border-t border-border"><DataTablePagination table={table} /></div>
        </motion.div>

        <RowDetailsSheet open={sheetOpen} onOpenChange={setSheetOpen} data={selectedUser} title="User Details" description="View and manage user information" renderContent={(user) => <UserDetailsContent user={user} />} />
      </motion.div>
    </div>
  );
};

export default TableDemo;
