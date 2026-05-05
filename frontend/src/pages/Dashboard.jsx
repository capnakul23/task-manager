import { useEffect, useState } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    api.get('/api/dashboard').then(r => { setStats(r.data); setLoading(false) })
  }, [])

  if (loading) return <div className="spinner" />

  const statItems = [
    { label: 'Total Tasks', value: stats.total_tasks, color: 'var(--accent)' },
    { label: 'Projects', value: stats.total_projects, color: '#60a5fa' },
    { label: 'Overdue', value: stats.overdue, color: 'var(--red)' },
    { label: 'Done', value: stats.by_status?.done || 0, color: 'var(--green)' },
  ]

  const statusItems = [
    { key: 'todo', label: 'To Do', color: '#60a5fa' },
    { key: 'in_progress', label: 'In Progress', color: 'var(--yellow)' },
    { key: 'done', label: 'Done', color: 'var(--green)' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Here's what's happening with your projects</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 28 }}>
        {statItems.map(s => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Tasks by Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {statusItems.map(s => {
              const count = stats.by_status?.[s.key] || 0
              const pct = stats.total_tasks ? Math.round((count / stats.total_tasks) * 100) : 0
              return (
                <div key={s.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 3, transition: 'width 0.6s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Tasks per Member</h3>
          {Object.keys(stats.per_user || {}).length === 0
            ? <div className="empty"><div className="empty-icon">👥</div><p>No assigned tasks yet</p></div>
            : Object.entries(stats.per_user).map(([name, count]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                    {name[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 14 }}>{name}</span>
                </div>
                <span className="badge badge-todo">{count} tasks</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
