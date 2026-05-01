import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name}! 🌿`);
      const role = data.user.role;
      navigate(`/${role}/dashboard`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* BG orbs */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="animate-slide-up" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="text-center mb-3">
          <div style={{ width: '64px', height: '64px', background: 'var(--gradient-primary)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: 'var(--shadow-glow)', animation: 'float 3s ease-in-out infinite' }}>🌿</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to continue your wellness journey</p>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPass ? 'text' : 'password'} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                  {showPass ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ marginTop: '0.5rem', justifyContent: 'center', fontSize: '1rem', padding: '0.9rem' }}>
              {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Signing in...</> : '✨ Sign In'}
            </button>
          </form>

          <div className="divider" />

          {/* Demo accounts */}
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>Quick Demo Login</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { label: '🎓 Student', email: 'student@demo.com', pass: 'demo123' },
                { label: '🧑‍⚕️ Counselor', email: 'counselor@demo.com', pass: 'demo123' },
                { label: '⚙️ Admin', email: 'admin@demo.com', pass: 'demo123' },
              ].map((d, i) => (
                <button key={i} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }}
                  onClick={() => setForm({ email: d.email, password: d.pass })}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create one free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
