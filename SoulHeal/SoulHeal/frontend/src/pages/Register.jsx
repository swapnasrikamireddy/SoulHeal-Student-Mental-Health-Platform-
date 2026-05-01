import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', department: '', phone: '', gender: '', specialization: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return setError('Please fill all required fields.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    setStep(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(`Welcome to SoulHeal, ${data.user.name}! 🌿`);
      navigate(`/${data.user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '5%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="animate-slide-up" style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <div className="text-center mb-3">
          <div style={{ width: '64px', height: '64px', background: 'var(--gradient-primary)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', boxShadow: 'var(--shadow-glow)', animation: 'float 3s ease-in-out infinite' }}>🌿</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Join SoulHeal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Your safe space for mental wellness</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, background: step >= s ? 'var(--gradient-primary)' : 'var(--bg-glass)', border: step >= s ? 'none' : '1px solid var(--border-glass)', color: step >= s ? 'white' : 'var(--text-muted)', transition: 'all 0.3s ease' }}>{s}</div>
              {s < 2 && <div style={{ width: '40px', height: '2px', background: step > s ? 'var(--primary)' : 'var(--border-glass)', transition: 'all 0.3s ease', borderRadius: '2px' }} />}
            </React.Fragment>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {step === 1 && (
            <form onSubmit={handleNext}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">I am a</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {[{ val: 'student', icon: '🎓', label: 'Student', desc: 'Track mood & book sessions' }, { val: 'counselor', icon: '🧑‍⚕️', label: 'Counselor', desc: 'Guide & support students' }].map(r => (
                    <button key={r.val} type="button" onClick={() => setForm({ ...form, role: r.val })}
                      style={{ padding: '1rem', borderRadius: '12px', border: `2px solid ${form.role === r.val ? 'var(--primary)' : 'var(--border-glass)'}`, background: form.role === r.val ? 'rgba(124,58,237,0.2)' : 'var(--bg-glass)', color: form.role === r.val ? 'var(--primary-light)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-main)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', boxShadow: form.role === r.val ? '0 0 15px rgba(124,58,237,0.25)' : 'none' }}>
                      <span style={{ fontSize: '1.6rem' }}>{r.icon}</span>
                      <span style={{ fontWeight: 700 }}>{r.label}</span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.7, textAlign: 'center' }}>{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type={showPass ? 'text' : 'password'} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                    {showPass ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary w-full" type="submit" style={{ justifyContent: 'center', fontSize: '1rem', padding: '0.9rem' }}>
                Continue →
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{form.role === 'student' ? 'Department' : 'Specialization'}</label>
                <input className="form-input" name={form.role === 'counselor' ? 'specialization' : 'department'}
                  placeholder={form.role === 'counselor' ? 'e.g. Student Counseling' : 'e.g. Computer Science'}
                  value={form.role === 'counselor' ? form.specialization : form.department} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                <button className="btn btn-primary" type="submit" disabled={loading} style={{ flex: 2, justifyContent: 'center', fontSize: '1rem' }}>
                  {loading ? <><span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Creating...</> : '🌿 Create Account'}
                </button>
              </div>
            </form>
          )}

          <div className="divider" />
          <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
