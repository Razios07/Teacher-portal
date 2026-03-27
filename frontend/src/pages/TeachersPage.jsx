import { useEffect, useState, useMemo } from 'react'
import { teacherAPI } from '../api'
import DataTable from '../components/ui/DataTable'
import Modal from '../components/ui/Modal'
import TeacherForm from '../components/teachers/TeacherForm'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

const GENDER_COLORS = {
  male:   'bg-blue-50 text-blue-700',
  female: 'bg-pink-50 text-pink-700',
  other:  'bg-ink-100 text-ink-600',
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState({ type: null, teacher: null })

  const fetchTeachers = async () => {
    try {
      const { data } = await teacherAPI.getAll()
      setTeachers(data.data)
    } catch {
      toast.error('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTeachers() }, [])

  const handleDelete = async (teacher) => {
    if (!window.confirm(`Delete ${teacher.first_name} ${teacher.last_name}?`)) return
    try {
      await teacherAPI.delete(teacher.id)
      toast.success('Teacher deleted')
      fetchTeachers()
    } catch {
      toast.error('Delete failed')
    }
  }

  const columns = useMemo(() => [
    {
      header: '#',
      accessorKey: 'id',
      size: 60,
      cell: ({ row }) => <span className="font-mono text-xs text-ink-400">#{row.original.id}</span>,
    },
    {
      header: 'Name',
      accessorFn: row => `${row.first_name} ${row.last_name}`,
      cell: ({ row: { original: t } }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-jade-100 flex items-center justify-center text-jade-700 text-xs font-semibold flex-shrink-0">
            {t.first_name?.[0]}{t.last_name?.[0]}
          </div>
          <div>
            <p className="font-medium text-ink-900">{t.first_name} {t.last_name}</p>
            <p className="text-xs text-ink-400">{t.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'University',
      accessorKey: 'university_name',
      cell: ({ getValue }) => <span className="text-ink-700">{getValue()}</span>,
    },
    {
      header: 'Department',
      accessorKey: 'department',
      cell: ({ getValue }) => (
        <span className="badge bg-ink-100 text-ink-600">{getValue()}</span>
      ),
    },
    {
      header: 'Designation',
      accessorKey: 'designation',
      cell: ({ getValue }) => <span className="text-ink-600 text-xs">{getValue()}</span>,
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
      cell: ({ getValue }) => (
        <span className={`badge ${GENDER_COLORS[getValue()] || 'bg-ink-100 text-ink-600'} capitalize`}>
          {getValue()}
        </span>
      ),
    },
    {
      header: 'Year',
      accessorKey: 'year_joined',
      size: 80,
      cell: ({ getValue }) => <span className="font-mono text-xs text-ink-500">{getValue()}</span>,
    },
    {
      header: 'Actions',
      id: 'actions',
      size: 100,
      enableSorting: false,
      cell: ({ row: { original: t } }) => (
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors"
            onClick={() => setModal({ type: 'view', teacher: t })}
            title="View"
          >
            <Eye size={14} />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-jade-50 text-ink-400 hover:text-jade-700 transition-colors"
            onClick={() => setModal({ type: 'edit', teacher: t })}
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-600 transition-colors"
            onClick={() => handleDelete(t)}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ], [])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Teachers</h1>
          <p className="text-ink-400 text-sm mt-0.5">{teachers.length} records</p>
        </div>
        <button
          className="btn-jade"
          onClick={() => setModal({ type: 'create', teacher: null })}
        >
          <Plus size={16} />
          Add Teacher
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-jade-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={teachers} searchPlaceholder="Search teachers…" />
      )}

      {/* Create modal */}
      <Modal
        open={modal.type === 'create'}
        onClose={() => setModal({ type: null, teacher: null })}
        title="Add New Teacher"
        size="lg"
      >
        <TeacherForm
          onSuccess={() => { setModal({ type: null, teacher: null }); fetchTeachers() }}
          onCancel={() => setModal({ type: null, teacher: null })}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={modal.type === 'edit'}
        onClose={() => setModal({ type: null, teacher: null })}
        title="Edit Teacher"
        size="lg"
      >
        {modal.teacher && (
          <TeacherForm
            teacher={modal.teacher}
            onSuccess={() => { setModal({ type: null, teacher: null }); fetchTeachers() }}
            onCancel={() => setModal({ type: null, teacher: null })}
          />
        )}
      </Modal>

      {/* View modal */}
      <Modal
        open={modal.type === 'view'}
        onClose={() => setModal({ type: null, teacher: null })}
        title="Teacher Details"
        size="md"
      >
        {modal.teacher && <TeacherDetail teacher={modal.teacher} />}
      </Modal>
    </div>
  )
}

function TeacherDetail({ teacher: t }) {
  const rows = [
    ['Email',       t.email],
    ['Phone',       t.phone || '—'],
    ['University',  t.university_name],
    ['Department',  t.department],
    ['Designation', t.designation],
    ['Subject',     t.subject],
    ['Gender',      t.gender],
    ['Year Joined', t.year_joined],
    ['Experience',  t.experience_years ? `${t.experience_years} yrs` : '—'],
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 pb-4 border-b border-ink-100">
        <div className="w-14 h-14 rounded-2xl bg-jade-100 flex items-center justify-center text-jade-700 text-lg font-semibold">
          {t.first_name?.[0]}{t.last_name?.[0]}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-ink-900">{t.first_name} {t.last_name}</h3>
          <p className="text-ink-400 text-sm">{t.designation}</p>
        </div>
      </div>

      <table className="w-full text-sm">
        <tbody className="divide-y divide-ink-100">
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td className="py-2.5 pr-4 text-ink-400 w-36">{k}</td>
              <td className="py-2.5 text-ink-800 font-medium">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {t.bio && (
        <div className="bg-ink-50 rounded-xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1.5">Bio</p>
          <p className="text-ink-700 text-sm leading-relaxed">{t.bio}</p>
        </div>
      )}
    </div>
  )
}
