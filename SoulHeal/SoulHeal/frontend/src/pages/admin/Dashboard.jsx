import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, appointmentAPI } from '../../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#dc2626'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getAnalytics(), appointmentAPI.getAll()]).then(([aRes, apptRes]) => {
      setAnalytics(aRes.data.analytics);
      setAppointments(apptRes.data.appointments.slice(0, 6));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  const pieData = analytics?.assessmentDistribution?.map(d => ({ name: d._id, value: d.count })) || [];

  const barData = [
    { name: 'Students', count: analytics?.totalStudents || 0 },
    { name: 'Counselors', count: analytics?.totalCounselors || 0 },
    { name: 'Moods', count: analytics?.totalMoods || 0 },
    { name: 'Assessments', count: analytics?.totalAssessments || 0 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title">⚙️ Admin Dashboard</div>
          <div className="topbar-subtitle">Platform analytics and management overview</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Manage Users</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/resources')}>Add Resource</button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '🎓', label: 'Total Students', value: analytics?.totalStudents || 0, color: 'var(--gradient-primary)', bg: 'rgba(124,58,237,0.15)' },
          { icon: '🧑‍⚕️', label: 'Counselors', value: analytics?.totalCounselors || 0, color: 'var(--gradient-success)', bg: 'rgba(16,185,129,0.15)' },
          { icon: '📅', label: 'Total Appointments', value: analytics?.totalAppointments || 0, color: 'var(--gradient-warn)', bg: 'rgba(245,158,11,0.15)' },
          { icon: '🆕', label: 'New This Week', value: analytics?.recentRegistrations || 0, color: 'var(--gradient-mood)', bg: 'rgba(244,114,182,0.15)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value" style={{ background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '💭', label: 'Mood Logs', value: analytics?.totalMoods || 0, color: 'var(--gradient-mood)', desc: 'Total mood entries across all students' },
          { icon: '📋', label: 'Assessments', value: analytics?.totalAssessments || 0, color: 'var(--gradient-primary)', desc: 'Self-assessments completed by students' },
          { icon: '⏳', label: 'Pending Appointments', value: analytics?.pendingAppointments || 0, color: 'var(--gradient-warn)', desc: 'Appointments awaiting counselor response' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ fontSize: '2rem', minWidth: '40px' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>📊 Platform Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9' }} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>🎯 Assessment Results Distribution</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[i % COLORS.length] }} />
                    <span style={{ color: 'var(--text-muted)' }}>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="empty-state" style={{ padding: '2rem' }}><p>No assessment data yet</p></div>}
        </div>
      </div>

      {/* Recent Appointments */}
      {appointments.length > 0 && (
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem' }}>📅 Recent Appointments</h3>
          </div>
          <div className="table-container">
            <table>
              <thead><tr><th>Student</th><th>Counselor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a._id}>
                    <td style={{ fontWeight: 500 }}>{a.studentId?.name || 'N/A'}</td>
                    <td>{a.counselorId?.name || 'N/A'}</td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                    <td>—</td>
                    <td>—</td>
                    <td><span className={`badge ${a.status === 'Confirmed' ? 'badge-success' : a.status === 'Pending' ? 'badge-warning' : a.status === 'Completed' ? 'badge-info' : 'badge-danger'}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
