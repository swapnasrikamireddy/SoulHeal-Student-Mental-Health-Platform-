import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI } from '../../api';

const statusColors = { Pending: 'badge-warning', Confirmed: 'badge-success', Completed: 'badge-info', Cancelled: 'badge-danger', Rescheduled: 'badge-primary' };

export default function CounselorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getCounselorAppointments().then(({ data }) => {
      setAppointments(data.appointments);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const pending = appointments.filter(a => a.status === 'Pending');
  const confirmed = appointments.filter(a => a.status === 'Confirmed');
  const completed = appointments.filter(a => a.status === 'Completed');
  const today = appointments.filter(a => {
    const d = new Date(a.appointmentDate);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'C';

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title">Welcome, {user?.name?.split(' ')[0]} 🧑‍⚕️</div>
          <div className="topbar-subtitle">{user?.specialization || 'Counselor'} · Your session overview</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/counselor/appointments')}>View All Appointments</button>
      </div>

      {/* Counselor Profile Card */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))', borderColor: 'rgba(16,185,129,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="avatar avatar-lg" style={{ background: 'var(--gradient-success)', fontSize: '1.5rem' }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.2rem' }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{user?.email}</p>
            <span className="badge badge-success">🧑‍⚕️ Counselor · {user?.specialization || 'General'}</span>
          </div>
          {user?.bio && <p style={{ maxWidth: '300px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{user.bio}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { icon: '📋', label: 'Total Requests', value: appointments.length, color: 'var(--gradient-primary)', bg: 'rgba(124,58,237,0.15)' },
          { icon: '⏳', label: 'Pending', value: pending.length, color: 'var(--gradient-warn)', bg: 'rgba(245,158,11,0.15)' },
          { icon: '✅', label: 'Confirmed', value: confirmed.length, color: 'var(--gradient-success)', bg: 'rgba(16,185,129,0.15)' },
          { icon: '🎯', label: 'Today\'s Sessions', value: today.length, color: 'var(--gradient-mood)', bg: 'rgba(244,114,182,0.15)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value" style={{ background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Pending Requests */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem' }}>⏳ Pending Requests</h3>
            <span className="badge badge-warning">{pending.length} new</span>
          </div>
          {pending.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pending.slice(0, 4).map(a => (
                <div key={a._id} style={{ padding: '1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.studentId?.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.15rem' }}>{new Date(a.appointmentDate).toLocaleDateString()} · {a.timeSlot}</div>
                    {a.reason && <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '0.15rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</div>}
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('/counselor/appointments')}>Review</button>
                </div>
              ))}
              {pending.length > 4 && <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'center' }} onClick={() => navigate('/counselor/appointments')}>View all {pending.length} pending</button>}
            </div>
          ) : <div className="empty-state" style={{ padding: '2rem' }}><div className="empty-icon">✅</div><p>No pending requests</p></div>}
        </div>

        {/* Today's Sessions */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem' }}>📅 Today's Sessions</h3>
            <span className="badge badge-success">{today.length} sessions</span>
          </div>
          {today.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {today.map(a => (
                <div key={a._id} style={{ padding: '1rem', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.studentId?.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>{a.timeSlot} · {a.type}</div>
                    </div>
                    <span className={`badge ${statusColors[a.status]}`}>{a.status}</span>
                  </div>
                  {a.meetingLink && <a href={a.meetingLink} target="_blank" rel="noreferrer" className="btn btn-success btn-sm" style={{ marginTop: '0.6rem', display: 'inline-flex' }}>🎥 Join</a>}
                </div>
              ))}
            </div>
          ) : <div className="empty-state" style={{ padding: '2rem' }}><div className="empty-icon">📅</div><p>No sessions today</p></div>}
        </div>
      </div>

      {/* Recent Completed */}
      {completed.length > 0 && (
        <div className="glass-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem' }}>✅ Recently Completed</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Student</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {completed.slice(0, 5).map(a => (
                  <tr key={a._id}>
                    <td><div style={{ fontWeight: 500 }}>{a.studentId?.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.studentId?.department}</div></td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                    <td>{a.timeSlot}</td>
                    <td>{a.type}</td>
                    <td><span className={`badge ${statusColors[a.status]}`}>{a.status}</span></td>
                    <td><button className="btn btn-secondary btn-sm" onClick={() => navigate(`/counselor/student/${a.studentId?._id}`)}>View Profile</button></td>
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
