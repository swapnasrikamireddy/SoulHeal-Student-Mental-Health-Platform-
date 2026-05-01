import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', overflowX: 'hidden' }}>
      {/* Animated Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '50%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 7s ease-in-out infinite' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, padding: '1.5rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', backdropFilter: 'blur(20px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', background: 'var(--gradient-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', boxShadow: 'var(--shadow-glow)' }}>🌿</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SoulHeal</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '6rem 2rem 4rem', maxWidth: '900px', margin: '0 auto' }}>
        <div className="badge badge-primary animate-fade-in" style={{ marginBottom: '1.5rem', fontSize: '0.8rem' }}>
          🌟 Your Mental Wellness Journey Starts Here
        </div>
        <h1 className="animate-slide-up" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #f1f5f9 0%, #a78bfa 50%, #67e8f9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
          Heal Your Mind,<br />Empower Your Life
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
          SoulHeal is a safe, confidential digital space designed for students to track emotions, take self-assessments, and connect with professional counselors — all in one platform.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg animate-glow" onClick={() => navigate('/register')}>
            Start Your Journey ✨
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            Sign In →
          </button>
        </div>
      </section>

      {/* Stats */}
      <section style={{ position: 'relative', zIndex: 1, padding: '2rem 3rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {[
            { icon: '👥', value: '10,000+', label: 'Students Supported' },
            { icon: '🧑‍⚕️', value: '200+', label: 'Expert Counselors' },
            { icon: '📈', value: '95%', label: 'Satisfaction Rate' },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="text-center mb-3">
          <h2 style={{ marginBottom: '1rem' }}>Everything You Need for <span className="text-gradient">Mental Wellness</span></h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>Comprehensive tools designed to support every step of your emotional health journey.</p>
        </div>
        <div className="grid-3" style={{ marginTop: '3rem', gap: '1.5rem' }}>
          {[
            { icon: '💭', title: 'Mood Tracking', desc: 'Log daily emotions with intuitive mood check-ins and visualize patterns over time with beautiful charts.', color: 'var(--gradient-mood)' },
            { icon: '📋', title: 'Self-Assessments', desc: 'Take evidence-based assessments for stress, anxiety, and emotional balance. Get instant personalized recommendations.', color: 'var(--gradient-primary)' },
            { icon: '🧑‍⚕️', title: 'Counselor Connect', desc: 'Book confidential appointments with professional counselors and get the guidance you deserve.', color: 'var(--gradient-success)' },
            { icon: '📚', title: 'Wellness Resources', desc: 'Access guided meditations, breathing exercises, articles, and helplines — curated for students.', color: 'var(--gradient-primary)' },
            { icon: '🔒', title: 'Private & Secure', desc: 'Your data stays private. Role-based access ensures only you and your assigned counselor see your records.', color: 'var(--gradient-warn)' },
            { icon: '📊', title: 'Progress Insights', desc: 'Track your mental wellness journey over time with clear analytics and weekly progress reports.', color: 'var(--gradient-success)' },
          ].map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '54px', height: '54px', background: f.color, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section style={{ position: 'relative', zIndex: 1, padding: '4rem 3rem', background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '3rem' }}>Built for <span className="text-gradient">Every Role</span></h2>
          <div className="grid-3">
            {[
              { icon: '🎓', role: 'Students', points: ['Track mood & emotions daily', 'Take self-assessments', 'Book counselor sessions', 'Access wellness library'], color: 'var(--primary)' },
              { icon: '🧑‍⚕️', role: 'Counselors', points: ['View appointment requests', 'Review student assessments', 'Provide guidance & notes', 'Manage session records'], color: 'var(--secondary)' },
              { icon: '⚙️', role: 'Administrators', points: ['Manage all users', 'Monitor platform activity', 'Add wellness resources', 'View analytics reports'], color: 'var(--accent)' },
            ].map((r, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem', borderColor: `${r.color}33` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{r.icon}</div>
                <h3 style={{ color: r.color, marginBottom: '1.25rem' }}>{r.role}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', textAlign: 'left' }}>
                  {r.points.map((p, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <span style={{ color: r.color }}>✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '6rem 2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Ready to Start Healing?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>Join thousands of students prioritizing their mental health today.</p>
        <button className="btn btn-primary btn-lg animate-glow" onClick={() => navigate('/register')}>
          Create Free Account 🌿
        </button>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '2rem 3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span>🌿</span>
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>SoulHeal</span>
        </div>
        <p>© 2024 SoulHeal. A safe space for student mental wellness. All rights reserved.</p>
      </footer>
    </div>
  );
}
