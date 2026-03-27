export default function StatCard({ label, value, icon: Icon, color = 'jade', sub }) {
  const colors = {
    jade:   'bg-jade-50 text-jade-600',
    ink:    'bg-ink-100 text-ink-600',
    amber:  'bg-amber-50 text-amber-600',
    red:    'bg-red-50 text-red-500',
  }
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[color]}`}>
            <Icon size={17} />
          </div>
        )}
      </div>
      <p className="text-3xl font-semibold text-ink-900 mt-2">{value}</p>
      {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
    </div>
  )
}
