import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../../api';
import toast from 'react-hot-toast';

const categoryOptions = ['Meditation', 'Breathing Exercise', 'Article', 'Video', 'Helpline', 'Stress Management', 'Motivation', 'Sleep', 'Journaling'];
const categoryIcons = { Meditation: '🧘', 'Breathing Exercise': '🌬️', Article: '📄', Video: '🎥', Helpline: '📞', 'Stress Management': '💆', Motivation: '💪', Sleep: '😴', Journaling: '📔' };

const defaultForm = { title: '', description: '', category: 'Meditation', content: '', url: '', duration: '', difficulty: 'Beginner', tags: '', isActive: true };

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    try {
      const { data } = await resourceAPI.getAll();
      setResources(data.resources);
    } catch { toast.error('Failed to load resources'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setForm(defaultForm); setEditId(null); setShowModal(true); };
  const openEdit = (r) => {
    setForm({ ...r, tags: r.tags?.join(', ') || '' });
    setEditId(r._id); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (editId) { await resourceAPI.update(editId, payload); toast.success('Resource updated!'); }
      else { await resourceAPI.create(payload); toast.success('Resource created!'); }
      setShowModal(false); setEditId(null); setForm(defaultForm);
      fetchResources();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await resourceAPI.delete(id); toast.success('Deleted'); fetchResources(); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = filter === 'All' ? resources : resources.filter(r => r.category === filter);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title">📚 Manage Resources</div>
          <div className="topbar-subtitle">Add and manage wellness resources for students</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Resource</button>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Resources', val: resources.length, icon: '📚' },
          { label: 'Active', val: resources.filter(r => r.isActive).length, icon: '✅' },
          { label: 'Total Views', val: resources.reduce((s, r) => s + (r.views || 0), 0), icon: '👁' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>{s.icon}</div>
            <div className="stat-value" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.8rem' }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {['All', ...categoryOptions].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)', border: `1px solid ${filter === cat ? 'var(--primary)' : 'var(--border-glass)'}`, background: filter === cat ? 'rgba(124,58,237,0.2)' : 'var(--bg-glass)', color: filter === cat ? 'var(--primary-light)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-main)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            {categoryIcons[cat] || '🌿'} {cat}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Resource</th><th>Category</th><th>Difficulty</th><th>Views</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{categoryIcons[r.category]}</div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{r.title}</div>
                        {r.duration && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱ {r.duration}</div>}
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{r.category}</span></td>
                  <td><span className={`badge ${r.difficulty === 'Beginner' ? 'badge-success' : r.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>{r.difficulty}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>👁 {r.views || 0}</td>
                  <td><span className={`badge ${r.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>{r.isActive ? '✅ Active' : '❌ Hidden'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)} style={{ fontSize: '0.75rem' }}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r._id, r.title)} style={{ fontSize: '0.75rem' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6}><div className="empty-state" style={{ padding: '2rem' }}><div className="empty-icon">📚</div><p>No resources found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? '✏️ Edit Resource' : '➕ Add Resource'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categoryOptions.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                    {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description *</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Content (detailed instructions)</label>
                  <textarea className="form-textarea" placeholder="Step-by-step guide or detailed content..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} />
                </div>
                <div className="form-group">
                  <label className="form-label">URL (optional)</label>
                  <input className="form-input" placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (optional)</label>
                  <input className="form-input" placeholder="e.g. 10 min" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-input" placeholder="stress, relaxation, mindfulness" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }} />
                  <label htmlFor="isActive" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>Active (visible to students)</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 2, justifyContent: 'center' }}>
                  {saving ? <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Saving...</> : editId ? '✅ Update Resource' : '➕ Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
