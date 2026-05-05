import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const STATUSES = ['todo', 'in_progress', 'done']
const STATUS_LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }
const PRIORITIES = ['low', 'medium', 'high']

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('tasks')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', due_date: '', priority: 'medium', assignee_id: '' })
  const [memberForm, setMemberForm] = useState({ email: '', role: 'member' })
  const [editTask, setEditTask] = useState(null)
  const [error, setError] = useState('')

  const myRole = project?.members?.find(m => m.user?.id === user?.id)?.role
  const isAdmin = myRole === 'admin'

  const load = async () => {
    const [p, t] = await Promise.all([api.get(`/projects/${id}`), api.get(`/tasks/${id}`)])
    setProject(p.data); setTasks(t.data); setLoading(false)
  }
  useEffect(() => { load() }, [id])

  const createTask = async e => {
    e.preventDefault(); setError('')
    try {
      const body = { ...taskForm, assignee_id: taskForm.assignee_id || null, due_date: taskForm.due_date || null }
      await api.post(`/tasks/${id}`, body)
      setShowTaskModal(false); setTaskForm({ title: '', description: '', due_date: '', priority: 'medium', assignee_id: '' }); load()
    } catch (err) { setError(err.response?.data?.detail || 'Failed') }
  }

  const updateTask = async (taskId, updates) => {
    await api.patch(`/tasks/${taskId}`, updates); load()
  }

  const deleteTask = async taskId => {
    if (!confirm('Delete this task?')) return
    await api.delete(`/tasks/${taskId}`); load()
  }

  const addMember = async e => {
    e.preventDefault(); setError('')
    try {
      await api.post(`/projects/${id}/members`, memberForm)
      setShowMemberModal(false); setMemberForm({ email: '', role: 'member' }); load()
    } catch (err) { setError(err.response?.data?.detail || 'Failed') }
  }

  const removeMember = async userId => {
    if (!confirm('Remove this member?')) return
    await api.delete(`/projects/${id}/members/${userId}`); load()
  }

  if (loading) return <div className="spinner" />

  const tasksByStatus = STATUSES.reduce((acc, s) => ({ ...acc, [s]: tasks.filter(t => t.status === s) }), {})

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>← Back</button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>{project?.name}</h1>
          {project?.description && <p style={{ color: 'var(--text2)', fontSize: 14 }}>{project.description}</p>}
        </div>
        <span className={`tag-${myRole}`} style={{ marginLeft: 'auto' }}>{myRole}</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['tasks', 'members'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setTab(t)}>
            {t === 'tasks' ? `Tasks (${tasks.length})` : `Members (${project?.members?.length})`}
          </button>
        ))}
        {isAdmin && tab === 'tasks' && <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowTaskModal(true)}>+ Add Task</button>}
        {isAdmin && tab === 'members' && <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowMemberModal(true)}>+ Add Member</button>}
      </div>

      {tab === 'tasks' && (
        <div className="grid-3">
          {STATUSES.map(status => (
            <div key={status}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{tasksByStatus[status].length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasksByStatus[status].length === 0
                  ? <div style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No tasks</div>
                  : tasksByStatus[status].map(task => (
                    <div key={task.id} className="task-card">
                      <div className="task-title">{task.title}</div>
                      {task.description && <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 8 }}>{task.description}</p>}
                      <div className="task-meta">
                        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                        {task.assignee && <span style={{ fontSize: 12, color: 'var(--text2)' }}>👤 {task.assignee.name}</span>}
                        {task.due_date && (
                          <span style={{ fontSize: 12, color: new Date(task.due_date) < new Date() && task.status !== 'done' ? 'var(--red)' : 'var(--text2)' }}>
                            📅 {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                        <select className="input" style={{ flex: 1, padding: '6px 10px', fontSize: 12 }}
                          value={task.status}
                          onChange={e => updateTask(task.id, { status: e.target.value })}>
                          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                        {isAdmin && <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task.id)}>✕</button>}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'members' && (
        <div className="card" style={{ maxWidth: 600 }}>
          {project?.members?.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {m.user?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{m.user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{m.user?.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`tag-${m.role}`}>{m.role}</span>
                {isAdmin && m.user?.id !== user?.id && (
                  <button className="btn btn-danger btn-sm" onClick={() => removeMember(m.user.id)}>Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showTaskModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowTaskModal(false)}>
          <div className="modal">
            <h2>Create Task</h2>
            <form onSubmit={createTask}>
              <div className="form-group">
                <label>Title</label>
                <input className="input" placeholder="Task title" value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="input" rows={2} value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Priority</label>
                  <select className="input" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input className="input" type="date" value={taskForm.due_date}
                    onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select className="input" value={taskForm.assignee_id} onChange={e => setTaskForm({ ...taskForm, assignee_id: e.target.value })}>
                  <option value="">Unassigned</option>
                  {project?.members?.map(m => <option key={m.user?.id} value={m.user?.id}>{m.user?.name}</option>)}
                </select>
              </div>
              {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowMemberModal(false)}>
          <div className="modal">
            <h2>Add Member</h2>
            <form onSubmit={addMember}>
              <div className="form-group">
                <label>Email Address</label>
                <input className="input" type="email" placeholder="member@example.com" value={memberForm.email}
                  onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="input" value={memberForm.role} onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {error && <div className="error-msg" style={{ marginBottom: 12 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
