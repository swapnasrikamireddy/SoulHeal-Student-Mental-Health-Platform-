import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import toast from 'react-hot-toast';

const roleColors = { student: 'badge-primary', counselor: 'badge-success', admin: 'badge-warning' };
const roleIcons = { student: '🎓', counselor: '🧑‍⚕️', admin: '⚙️' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await adminAPI.getUsers();
      setUsers(data.users);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleToggle = async (id) => {
    setActionLoading(id);
    try {
      const { data } = await adminAPI.toggleStatus(id);
      toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch { toast.error('Action failed'); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = users.filter(u => {
    const matchRole = filter === 'all' || u.role === filter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <div className="topbar-title">👥 Manage Users</div>
          <div className="topbar-subtitle">View and manage all platform users</div>
        </div>
        <input className="form-input" placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '260px', fontSize: '0.85rem', padding: '0.6rem 1rem' }} />
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Users', val: users.length, icon: '👥', color: 'var(--gradient-primary)' },
          { label: 'Students', val: counts.student || 0, icon: '🎓', color: 'var(--gradient-primary)' },
          { label: 'Counselors', val: counts.counselor || 0, icon: '🧑‍⚕️', color: 'var(--gradient-success)' },
          { label: 'Admins', val: counts.admin || 0, icon: '⚙️', color: 'var(--gradient-warn)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124,58,237,0.15)' }}>{s.icon}</div>
            <div className="stat-value" style={{ background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="tabs">
        {['all', 'student', 'counselor', 'admin'].map(r => (
          <button key={r} className={`tab-btn ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)} style={{ textTransform: 'capitalize' }}>
            {r === 'all' ? '🗂 All Users' : `${roleIcons[r]} ${r.charAt(0).toUpperCase() + r.slice(1)}s`}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department / Specialization</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="avatar" style={{ background: u.role === 'counselor' ? 'var(--gradient-success)' : u.role === 'admin' ? 'var(--gradient-warn)' : 'var(--gradient-primary)', fontSize: '0.9rem', width: '34px', height: '34px' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</td>
                  <td><span className={`badge ${roleColors[u.role]}`}>{roleIcons[u.role]} {u.role}</span></td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.department || u.specialization || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                      {u.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className={`btn btn-sm ${u.isActive ? 'btn-secondary' : 'btn-success'}`} onClick={() => handleToggle(u._id)} disabled={actionLoading === u._id} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                        {actionLoading === u._id ? '...' : u.isActive ? '🔒 Deactivate' : '✅ Activate'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id, u.name)} style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7}><div className="empty-state" style={{ padding: '2rem' }}><div className="empty-icon">👥</div><p>No users found</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
