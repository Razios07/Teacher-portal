import { useEffect, useState, useMemo } from 'react'
import { authAPI } from '../api'
import DataTable from '../components/ui/DataTable'
import { CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsersPage() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authAPI.listUsers()
      .then(({ data }) => setUsers(data.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const columns = useMemo(() => [
    {
      header: '#',
      accessorKey: 'id',
      size: 60,
      cell: ({ getValue }) => <span className="font-mono text-xs text-ink-400">#{getValue()}</span>,
    },
    {
      header: 'User',
      accessorFn: row => `${row.first_name} ${row.last_name}`,
      cell: ({ row: { original: u } }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-ink-200 flex items-center justify-center text-ink-600 text-xs font-semibold flex-shrink-0">
            {u.first_name?.[0]}{u.last_name?.[0]}
          </div>
          <div>
            <p className="font-medium text-ink-900">{u.first_name} {u.last_name}</p>
            <p className="text-xs text-ink-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: ({ getValue }) => (
        <span className="text-ink-600 font-mono text-xs">{getValue() || '—'}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'is_active',
      cell: ({ getValue }) => getValue()
        ? <span className="badge bg-jade-50 text-jade-700 gap-1"><CheckCircle size={11} /> Active</span>
        : <span className="badge bg-red-50 text-red-600 gap-1"><XCircle size={11} /> Inactive</span>,
    },
    {
      header: 'Joined',
      accessorKey: 'created_at',
      cell: ({ getValue }) => {
        const d = new Date(getValue())
        return <span className="text-ink-500 text-xs">{d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      },
    },
  ], [])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="page-title">Users</h1>
        <p className="text-ink-400 text-sm mt-0.5">{users.length} registered accounts</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-jade-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={users} searchPlaceholder="Search users…" />
      )}
    </div>
  )
}
