import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { teacherAPI } from '../api'
import { authAPI } from '../api'
import StatCard from '../components/ui/StatCard'
import { GraduationCap, Users, Building2, CalendarDays } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [teachers, setTeachers] = useState([])
  const [users,    setUsers]    = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([teacherAPI.getAll(), authAPI.listUsers()])
      .then(([t, u]) => {
        setTeachers(t.data.data)
        setUsers(u.data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const universities = [...new Set(teachers.map(t => t.university_name))].length
  const avgYear = teachers.length
    ? Math.round(teachers.reduce((s, t) => s + Number(t.year_joined), 0) / teachers.length)
    : '—'

  const byGender = teachers.reduce((acc, t) => {
    acc[t.gender] = (acc[t.gender] || 0) + 1
    return acc
  }, {})

  const recent = [...teachers].slice(0, 5)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-jade-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-ink-400 text-sm mb-1">Good day 👋</p>
        <h1 className="page-title">{user?.first_name} {user?.last_name}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Teachers"    value={teachers.length} icon={GraduationCap} color="jade" />
        <StatCard label="Registered Users"  value={users.length}    icon={Users}         color="ink"  />
        <StatCard label="Universities"      value={universities}    icon={Building2}     color="amber" />
        <StatCard label="Avg. Join Year"    value={avgYear}         icon={CalendarDays}  color="jade" />
      </div>

      {/* Two-col: gender breakdown + recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Gender breakdown */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-700 mb-5">Gender Distribution</h2>
          <div className="space-y-3">
            {Object.entries(byGender).map(([gender, count]) => {
              const pct = Math.round((count / teachers.length) * 100)
              const colors = { male: 'bg-jade-500', female: 'bg-amber-400', other: 'bg-ink-400' }
              return (
                <div key={gender}>
                  <div className="flex justify-between text-xs text-ink-500 mb-1.5">
                    <span className="capitalize">{gender}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[gender] || 'bg-ink-400'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent teachers */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink-700 mb-5">Recent Teachers</h2>
          <div className="space-y-3">
            {recent.length === 0 && <p className="text-ink-400 text-sm">No teachers yet.</p>}
            {recent.map(t => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-jade-100 flex items-center justify-center text-jade-700 text-xs font-semibold flex-shrink-0">
                  {t.first_name?.[0]}{t.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900 truncate">{t.first_name} {t.last_name}</p>
                  <p className="text-xs text-ink-400 truncate">{t.designation} · {t.department}</p>
                </div>
                <span className="text-xs text-ink-400 font-mono">{t.year_joined}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
