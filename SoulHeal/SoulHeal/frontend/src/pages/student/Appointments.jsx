import React, { useState, useEffect } from 'react';
import { appointmentAPI, adminAPI } from '../../api';
import toast from 'react-hot-toast';

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];
const statusColors = { Pending: 'badge-warning', Confirmed: 'badge-success', Completed: 'badge-info', Cancelled: 'badge-danger', Rescheduled: 'badge-primary' };

export default function Appointments() {
  const [counselors, setCounselors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ counselorId: '', appointmentDate: '', timeSlot: '', type: 'Virtual', reason: '' });
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [cRes, aRes] = await Promise.all([adminAPI.getCounselors(), appointmentAPI.getMy()]);
      setCounselors(cRes.data.counselors);
      setAppointments(aRes.data.appointments);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await appointmentAPI.book(form);
      toast.success('Appointment booked! 📅');
      setShowModal(false);
      setForm({ counselorId: '', appointmentDate: '', timeSlot: '', type: 'Virtual', reason: '' });
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setSaving(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      toast.success('Appointment cancelled');
      fetchAll();
    } catch { toast.error('Cancel failed'); }
  };

  const upcoming = appointments.filter(a => ['Pending', 'Confirmed'].includes(a.status));
  const past = appointments.filter(a => ['Completed', 'Cancelled'].includes(a.status));
  const displayed = activeTab === 'upcoming' ? upcoming : past;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title">📅 Appointments</div>
          <div className="topbar-subtitle">Book and manage your counseling sessions</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Book Session</button>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Sessions', value: appointments.length, icon: '📊', color: 'var(--gradient-primary)' },
          { label: 'Upcoming', value: upcoming.length, icon: '⏰', color: 'var(--gradient-warn)' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'Completed').length, icon: '✅', color: 'var(--gradient-success)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>{s.icon}</div>
            <div className="stat-value" style={{ background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.8rem' }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>⏰ Upcoming ({upcoming.length})</button>
        <button className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>📜 Past ({past.length})</button>
      </div>

      {displayed.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayed.map(a => (
            <div key={a._id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid rgba(124,58,237,0.2)' }}>🧑‍⚕️</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{a.counselorId?.name || 'Counselor'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.15rem' }}>{a.counselorId?.specialization || 'Counseling'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Date</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{new Date(a.appointmentDate).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Time</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{a.timeSlot}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>Type</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{a.type}</div>
                  </div>
                  <span className={`badge ${statusColors[a.status]}`}>{a.status}</span>
                  {['Pending', 'Confirmed'].includes(a.status) && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a._id)}>Cancel</button>
                  )}
                </div>
              </div>
              {(a.reason || a.counselorNotes) && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
                  {a.reason && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Reason:</strong> {a.reason}</p>}
                  {a.counselorNotes && <p style={{ fontSize: '0.85rem', color: 'var(--accent-green)', marginTop: '0.5rem' }}><strong>Counselor Notes:</strong> {a.counselorNotes}</p>}
                  {a.meetingLink && <a href={a.meetingLink} target="_blank" rel="noreferrer" className="btn btn-success btn-sm" style={{ marginTop: '0.75rem', display: 'inline-flex' }}>🎥 Join Meeting</a>}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">{activeTab === 'upcoming' ? '📅' : '📜'}</div>
          <h3>{activeTab === 'upcoming' ? 'No upcoming appointments' : 'No past appointments'}</h3>
          {activeTab === 'upcoming' && <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(true)}>Book Your First Session</button>}
        </div>
      )}

      {/* Book Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3 className="modal-title">📅 Book a Session</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleBook}>
              <div className="form-group">
                <label className="form-label">Select Counselor *</label>
                <select className="form-select" value={form.counselorId} onChange={e => setForm({ ...form, counselorId: e.target.value })} required>
                  <option value="">Choose a counselor...</option>
                  {counselors.map(c => <option key={c._id} value={c._id}>{c.name} — {c.specialization}</option>)}
                </select>
              </div>

              {form.counselorId && (
                <div className="animate-slide-up" style={{ padding: '0.85rem', background: 'rgba(124,58,237,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: '1.25rem' }}>
                  {(() => { const c = counselors.find(x => x._id === form.counselorId); return c ? <p style={{ fontSize: '0.85rem', color: 'var(--primary-light)' }}>🧑‍⚕️ <strong>{c.name}</strong> · {c.specialization}</p> : null; })()}
                </div>
              )}

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input className="form-input" type="date" min={minDateStr} value={form.appointmentDate} onChange={e => setForm({ ...form, appointmentDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Session Type *</label>
                  <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option>Virtual</option><option>In-Person</option><option>Chat</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                  {timeSlots.map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, timeSlot: t })}
                      style={{ padding: '0.45rem 0.25rem', borderRadius: '8px', border: `1px solid ${form.timeSlot === t ? 'var(--primary)' : 'var(--border-glass)'}`, background: form.timeSlot === t ? 'rgba(124,58,237,0.2)' : 'var(--bg-glass)', color: form.timeSlot === t ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--font-main)', transition: 'all 0.2s' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Concern (optional)</label>
                <textarea className="form-textarea" placeholder="Briefly describe what you'd like to discuss..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={3} style={{ minHeight: '80px' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 2, justifyContent: 'center' }}>
                  {saving ? <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Booking...</> : '📅 Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
