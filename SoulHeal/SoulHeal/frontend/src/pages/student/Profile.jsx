import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '', phone: user?.phone || '', gender: user?.gender || '', bio: user?.bio || '', specialization: user?.specialization || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const roleGradients = { student: 'var(--gradient-primary)', counselor: 'var(--gradient-success)', admin: 'var(--gradient-warn)' };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated! ✨');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return toast.error('Passwords do not match');
    if (passForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setChangingPass(true);
    try {
      await authAPI.changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed successfully! 🔒');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Password change failed'); }
    finally { setChangingPass(false); }
  };

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div className="topbar-title">👤 My Profile</div>
      </div>

      {/* Profile Header */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div className="avatar avatar-xl" style={{ background: roleGradients[user?.role], fontSize: '2rem', boxShadow: 'var(--shadow-glow)' }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: '0.25rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`badge ${user?.role === 'student' ? 'badge-primary' : user?.role === 'counselor' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.8rem' }}>
                {user?.role === 'student' ? '🎓' : user?.role === 'counselor' ? '🧑‍⚕️' : '⚙️'} {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
              {user?.department && <span className="badge badge-info">🏛 {user.department}</span>}
              {user?.specialization && <span className="badge badge-success">💊 {user.specialization}</span>}
              {user?.isActive && <span className="badge badge-success">✅ Active</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2rem', textAlign: 'center' }}>
            {[{ label: 'Member Since', val: new Date(user?.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' }) || 'N/A' }].map((s, i) => (
              <div key={i}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-light)' }}>{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>✏️ Edit Profile</button>
        <button className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>🔒 Change Password</button>
        <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>ℹ️ Account Info</button>
      </div>

      {activeTab === 'profile' && (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Update Profile Information</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            {user?.role === 'student' && (
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-input" placeholder="e.g. Computer Science" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
              </div>
            )}
            {user?.role === 'counselor' && (
              <>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input className="form-input" placeholder="e.g. Student Counseling" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-textarea" placeholder="Tell students about your approach..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
                </div>
              </>
            )}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving} style={{ justifyContent: 'center' }}>
              {saving ? <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Saving...</> : '💾 Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '480px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
              <div key={field} className="form-group">
                <label className="form-label">{['Current Password', 'New Password', 'Confirm New Password'][i]}</label>
                <input className="form-input" type="password" value={passForm[field]} onChange={e => setPassForm({ ...passForm, [field]: e.target.value })} placeholder={['Enter current password', 'Min. 6 characters', 'Re-enter new password'][i]} required />
              </div>
            ))}
            <button className="btn btn-primary" type="submit" disabled={changingPass} style={{ justifyContent: 'center' }}>
              {changingPass ? <><span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Changing...</> : '🔒 Change Password'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '560px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Full Name', val: user?.name },
              { label: 'Email Address', val: user?.email },
              { label: 'Account Role', val: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
              { label: 'Department', val: user?.department || 'Not set' },
              { label: 'Phone', val: user?.phone || 'Not set' },
              { label: 'Gender', val: user?.gender?.replace(/_/g, ' ') || 'Not set' },
              { label: 'Account Status', val: user?.isActive ? '✅ Active' : '❌ Inactive' },
              { label: 'Member Since', val: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
