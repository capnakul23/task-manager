import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,101,132,0.08) 0%, transparent 50%), var(--bg)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)', fontWeight: 800 }}>
          TaskFlow
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px' }}>
        <div style={{
          display: 'inline-block', padding: '6px 16px', borderRadius: 20,
          background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
          color: 'var(--accent)', fontSize: 13, fontWeight: 500, marginBottom: 28
        }}>
          ✦ Team collaboration, simplified
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 800, lineHeight: 1.1, maxWidth: 800,
          background: 'linear-gradient(135deg, #fff 40%, rgba(108,99,255,0.8))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 24
        }}>
          Manage Tasks.<br />Ship Faster.
        </h1>

        <p style={{ color: 'var(--text2)', fontSize: 18, maxWidth: 540, lineHeight: 1.7, marginBottom: 40 }}>
          TaskFlow brings your team together. Create projects, assign tasks, track progress — all in one clean workspace.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('/signup')}>
            Start for free →
          </button>
          <button className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('/login')}>
            Sign in
          </button>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 10, marginTop: 56, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['✓ Role-based access', '✓ Kanban board', '✓ Task assignment', '✓ Due dates & priorities', '✓ Team dashboard'].map(f => (
            <span key={f} style={{
              padding: '8px 16px', borderRadius: 20, background: 'var(--surface)',
              border: '1px solid var(--border)', color: 'var(--text2)', fontSize: 13
            }}>{f}</span>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 48, marginTop: 72, padding: '32px 48px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
          {[['Projects', 'Organize work'], ['Tasks', 'Track everything'], ['Teams', 'Collaborate']].map(([label, sub]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>∞</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
        Built with FastAPI + React · TaskFlow © 2025
      </div>
    </div>
  )
}
