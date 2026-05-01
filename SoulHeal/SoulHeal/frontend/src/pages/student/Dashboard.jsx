import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { moodAPI, assessmentAPI, appointmentAPI } from '../../api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const moodEmoji = { Happy: '😊', Calm: '😌', Anxious: '😰', Sad: '😢', Stressed: '😤', Angry: '😠', Overwhelmed: '😵', Motivated: '💪', Lonely: '😔', Hopeful: '🌟' };
const resultColors = { Minimal: 'badge-success', Low: 'badge-info', Moderate: 'badge-warning', High: 'badge-danger', Severe: 'badge-danger' };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Mood Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [moodRes, assessRes, apptRes] = await Promise.all([
          moodAPI.getAnalytics(),
          assessmentAPI.getAll(),
          appointmentAPI.getMy(),
        ]);
        setAnalytics(moodRes.data.analytics);
        setAssessments(assessRes.data.assessments.slice(0, 3));
        setAppointments(apptRes.data.appointments.filter(a => a.status === 'Pending' || a.status === 'Confirmed').slice(0, 3));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const chartData = analytics?.recentMoods?.map(m => ({
    date: new Date(m.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    score: m.moodScore,
  })) || [];

  const topMood = analytics?.moodCounts
    ? Object.entries(analytics.moodCounts).sort((a, b) => b[1] - a[1])[0]
    : null;

  if (loading) return <div className="page-loader"><div className="spinner" /><p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p></div>;

  return (
    <div className="animate-fade-in">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">{greeting}, {user?.name?.split(' ')[0]} 👋</div>
          <div className="topbar-subtitle">Here's how your mental wellness journey looks today</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={() => navigate('/student/mood')}>+ Log Mood</button>
          <button className="btn btn-secondary" onClick={() => navigate('/student/assessment')}>Take Assessment</button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '💭', label: 'Mood Entries', value: analytics?.totalEntries || 0, color: 'var(--gradient-mood)', bg: 'rgba(244,114,182,0.15)' },
          { icon: '⭐', label: 'Avg Mood Score', value: analytics?.averageScore ? `${analytics.averageScore}/10` : 'N/A', color: 'var(--gradient-primary)', bg: 'rgba(124,58,237,0.15)' },
          { icon: '📋', label: 'Assessments', value: assessments.length || 0, color: 'var(--gradient-success)', bg: 'rgba(16,185,129,0.15)' },
          { icon: '📅', label: 'Upcoming Sessions', value: appointments.length || 0, color: 'var(--gradient-warn)', bg: 'rgba(245,158,11,0.15)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value" style={{ background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Mood Chart */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Mood Trend</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 7 entries</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/mood')}>View All →</button>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="url(#moodGrad)" strokeWidth={3} dot={{ fill: '#7c3aed', r: 5 }} activeDot={{ r: 7 }} />
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-icon">💭</div>
              <p>No mood entries yet. Start logging!</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/student/mood')}>Log First Mood</button>
            </div>
          )}
        </div>

        {/* Mood Distribution */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Mood Patterns</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 30 days</p>
            </div>
            {topMood && <span className="badge badge-primary">{moodEmoji[topMood[0]]} Most: {topMood[0]}</span>}
          </div>
          {analytics?.moodCounts && Object.keys(analytics.moodCounts).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(analytics.moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([mood, count]) => {
                const max = Math.max(...Object.values(analytics.moodCounts));
                const pct = Math.round((count / max) * 100);
                return (
                  <div key={mood}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                      <span>{moodEmoji[mood]} {mood}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count}x</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-icon">📊</div>
              <p>Log moods to see patterns</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid-2">
        {/* Recent Assessments */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Recent Assessments</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/assessment')}>Take New →</button>
          </div>
          {assessments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assessments.map(a => (
                <div key={a._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.assessmentType}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{new Date(a.completedAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{a.score}/{a.maxScore}</span>
                    <span className={`badge ${resultColors[a.result]}`}>{a.result}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-icon">📋</div>
              <p>No assessments taken yet</p>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem' }}>Upcoming Sessions</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/student/appointments')}>Book New →</button>
          </div>
          {appointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {appointments.map(a => (
                <div key={a._id} style={{ padding: '0.85rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dr. {a.counselorId?.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{new Date(a.appointmentDate).toLocaleDateString()} · {a.timeSlot}</div>
                    </div>
                    <span className={`badge ${a.status === 'Confirmed' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-icon">📅</div>
              <p>No upcoming appointments</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/student/appointments')}>Book Session</button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card" style={{ padding: '1.75rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.25rem', fontSize: '1.05rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { icon: '💭', label: 'Log Mood', path: '/student/mood', color: 'var(--gradient-mood)' },
            { icon: '📋', label: 'Assessment', path: '/student/assessment', color: 'var(--gradient-primary)' },
            { icon: '🧑‍⚕️', label: 'Book Counselor', path: '/student/appointments', color: 'var(--gradient-success)' },
            { icon: '📚', label: 'Resources', path: '/student/resources', color: 'var(--gradient-warn)' },
          ].map((q, i) => (
            <button key={i} onClick={() => navigate(q.path)} style={{ flex: 1, minWidth: '120px', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)', background: 'var(--bg-glass)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition)', color: 'var(--text-primary)', fontFamily: 'var(--font-main)' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border-glass)'; }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: q.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{q.icon}</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
