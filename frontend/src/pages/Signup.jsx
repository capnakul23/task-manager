import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed')
    } finally { setLoading(false) }
  }

  const set = field => e => setForm({ ...form, [field]: e.target.value })

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-logo">TaskFlow</div>
        <p className="auth-sub">Create your account</p>
        <div className="card">
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Full Name</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="input" type="password" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, color: 'var(--text2)', fontSize: 14 }}>
            Have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
