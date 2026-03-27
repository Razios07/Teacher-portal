import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'

export default function DataTable({ columns, data, searchPlaceholder = 'Search…' }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting,      setSorting]      = useState([])

  const table = useReactTable({
    data,
    columns,
    state:              { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange:    setSorting,
    getCoreRowModel:    getCoreRowModel(),
    getFilteredRowModel:getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel:  getSortedRowModel(),
    initialState:       { pagination: { pageSize: 10 } },
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          className="input-field pl-9"
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm data-table">
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id} className="border-b border-ink-100">
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-ink-500 uppercase tracking-wider select-none"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className={`flex items-center gap-1 hover:text-ink-800 transition-colors ${header.column.getCanSort() ? 'cursor-pointer' : 'cursor-default'}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            header.column.getIsSorted() === 'asc'  ? <ChevronUp size={13} /> :
                            header.column.getIsSorted() === 'desc' ? <ChevronDown size={13} /> :
                            <ChevronsUpDown size={13} className="opacity-30" />
                          )}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-ink-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center text-ink-400">
                    No records found
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 text-ink-800 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-ink-500">
        <span>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
          <strong>{table.getPageCount()}</strong> — {table.getFilteredRowModel().rows.length} records
        </span>
        <div className="flex items-center gap-1">
          <button
            className="btn-secondary !px-2.5 !py-1.5"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            className="btn-secondary !px-2.5 !py-1.5"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
