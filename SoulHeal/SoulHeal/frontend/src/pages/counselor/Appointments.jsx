import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../../api';
import toast from 'react-hot-toast';

const statusColors = { Pending: 'badge-warning', Confirmed: 'badge-success', Completed: 'badge-info', Cancelled: 'badge-danger', Rescheduled: 'badge-primary' };

export default function CounselorAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updateModal, setUpdateModal] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', counselorNotes: '', meetingLink: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await appointmentAPI.getCounselorAppointments();
      setAppointments(data.appointments);
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  };

  const openUpdateModal = (appt) => {
    setUpdateModal(appt);
    setUpdateForm({ status: appt.status, counselorNotes: appt.counselorNotes || '', meetingLink: appt.meetingLink || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await appointmentAPI.update(updateModal._id, updateForm);
      toast.success('Appointment updated! ✅');
      setUpdateModal(null);
      fetchAppointments();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const counts = appointments.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title">📅 Student Appointments</div>
          <div className="topbar-subtitle">Review, confirm, and manage all student sessions</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total', val: appointments.length, color: 'var(--gradient-primary)', icon: '📊' },
          { label: 'Pending', val: counts['Pending'] || 0, color: 'var(--gradient-warn)', icon: '⏳' },
          { label: 'Confirmed', val: counts['Confirmed'] || 0, color: 'var(--gradient-success)', icon: '✅' },
          { label: 'Completed', val: counts['Completed'] || 0, color: 'linear-gradient(135deg, #06b6d4, #6366f1)', icon: '🎯' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilter(s.label === 'Total' ? 'all' : s.label)}>
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>{s.icon}</div>
            <div className="stat-value" style={{ background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="tabs">
        {['all', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
          <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
            {f === 'all' ? '🗂 All' : f}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(a => (
            <div key={a._id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="avatar" style={{ background: 'var(--gradient-primary)' }}>{a.studentId?.name?.[0] || 'S'}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{a.studentId?.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{a.studentId?.email}</div>
                    {a.studentId?.department && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>🏛 {a.studentId.department}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{new Date(a.appointmentDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.timeSlot}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.type}</div>
                  </div>
                  <span className={`badge ${statusColors[a.status]}`}>{a.status}</span>
                </div>
              </div>

              {a.reason && (
                <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Student's Concern:</strong>
                  <p style={{ marginTop: '0.3rem', color: 'var(--text-secondary)' }}>{a.reason}</p>
                </div>
              )}

              {a.counselorNotes && (
                <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.85rem' }}>
                  <strong style={{ color: '#34d399', fontSize: '0.75rem', textTransform: 'uppercase' }}>Your Notes:</strong>
                  <p style={{ marginTop: '0.3rem', color: 'var(--text-secondary)' }}>{a.counselorNotes}</p>
                </div>
              )}

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {!['Completed', 'Cancelled'].includes(a.status) && (
                  <button className="btn btn-primary btn-sm" onClick={() => openUpdateModal(a)}>✏️ Update Status</button>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/counselor/student/${a.studentId?._id}`)}>👤 View Student Profile</button>
                {a.meetingLink && <a href={a.meetingLink} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">🎥 Join Meeting</a>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No appointments found</h3>
          <p>No {filter === 'all' ? '' : filter.toLowerCase() + ' '}appointments at the moment</p>
        </div>
      )}

      {/* Update Modal */}
      {updateModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setUpdateModal(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">Update Appointment</h3>
              <button className="modal-close" onClick={() => setUpdateModal(null)}>×</button>
            </div>
            <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 600 }}>{updateModal.studentId?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(updateModal.appointmentDate).toLocaleDateString()} · {updateModal.timeSlot}</div>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                  {['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {updateForm.status === 'Confirmed' && (
                <div className="form-group">
                  <label className="form-label">Meeting Link (optional)</label>
                  <input className="form-input" placeholder="https://meet.google.com/..." value={updateForm.meetingLink} onChange={e => setUpdateForm({ ...updateForm, meetingLink: e.target.value })} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Counselor Notes (optional)</label>
                <textarea className="form-textarea" placeholder="Add notes about this session..." value={updateForm.counselorNotes} onChange={e => setUpdateForm({ ...updateForm, counselorNotes: e.target.value })} rows={4} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setUpdateModal(null)}>Cancel</button>
                <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 2, justifyContent: 'center' }}>
                  {saving ? <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Saving...</> : '✅ Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
