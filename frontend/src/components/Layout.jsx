import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ name }) => {
  const icons = { dashboard: '⊞', projects: '◫', logout: '→' }
  return <span style={{ fontSize: 16 }}>{icons[name] || '•'}</span>
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const nav = [
    { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { label: 'Projects', icon: 'projects', path: '/projects' },
  ]

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          TaskFlow
          <span>Team Manager</span>
        </div>
        <nav style={{ flex: 1 }}>
          {nav.map(n => (
            <button
              key={n.path}
              className={`nav-item ${location.pathname === n.path ? 'active' : ''}`}
              onClick={() => navigate(n.path)}
            >
              <Icon name={n.icon} /> {n.label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ padding: '8px 12px', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{user?.email}</div>
          </div>
          <button className="nav-item" onClick={() => { logout(); navigate('/') }}>
            <Icon name="logout" /> Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
