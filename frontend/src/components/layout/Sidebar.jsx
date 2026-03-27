import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, GraduationCap, Users, LogOut, BookOpen, ChevronRight
} from 'lucide-react'

const links = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/teachers',   label: 'Teachers',   icon: GraduationCap   },
  { to: '/users',      label: 'Users',      icon: Users            },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-ink-900 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-ink-700 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-jade-500 flex items-center justify-center">
          <BookOpen size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Teacher</p>
          <p className="text-jade-400 text-xs font-mono">Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
               ${isActive
                 ? 'bg-jade-600 text-white'
                 : 'text-ink-300 hover:bg-ink-800 hover:text-white'}`
            }
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User block */}
      <div className="px-4 py-5 border-t border-ink-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-jade-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.first_name} {user?.last_name}</p>
            <p className="text-ink-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-ink-300 hover:bg-red-900/40 hover:text-red-300 text-sm transition-all duration-150"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
