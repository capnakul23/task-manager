import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = () => api.get('/projects')
    .then(r => { setProjects(r.data); setLoading(false) })
    .catch(err => { setLoadError(err.response?.data?.detail || 'Failed to load projects'); setLoading(false) })
  useEffect(() => { load() }, [])

  const create = async e => {
    e.preventDefault(); setError('')
    try {
      await api.post('/projects', form)
      setShowModal(false); setForm({ name: '', description: '' }); load()
    } catch (err) { setError(err.response?.data?.detail || 'Failed') }
  }

  if (loading) return <div className="spinner" />
  if (loadError) return <div className="card" style={{ textAlign: 'center', color: 'var(--error, #e74c3c)', padding: '2rem' }}>⚠️ {loadError}</div>

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Projects</h1>
          <p>Manage your team projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Project</button>
      </div>

      {projects.length === 0
        ? <div className="empty card"><div className="empty-icon">📁</div><p>No projects yet. Create one to get started!</p></div>
        : <div className="grid-3">
          {projects.map(p => {
            const myRole = p.members?.find(m => m.user)?.role
            return (
              <div key={p.id} className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
                onClick={() => navigate(`/projects/${p.id}`)}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{p.name}</h3>
                </div>
                {p.description && <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 14 }}>{p.description}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>👥 {p.members?.length || 0} members</span>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      }

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <h2>Create Project</h2>
            <form onSubmit={create}>
              <div className="form-group">
                <label>Project Name</label>
                <input className="input" placeholder="e.g. Website Redesign" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea className="input" rows={3} placeholder="What is this project about?"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
