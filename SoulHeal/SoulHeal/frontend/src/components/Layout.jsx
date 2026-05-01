import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const studentNav = [
  { path: '/student/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/student/mood', icon: '💭', label: 'Mood Tracker' },
  { path: '/student/assessment', icon: '📋', label: 'Self Assessment' },
  { path: '/student/appointments', icon: '📅', label: 'Appointments' },
  { path: '/student/resources', icon: '📚', label: 'Wellness Resources' },
  { path: '/student/profile', icon: '👤', label: 'My Profile' },
];

const counselorNav = [
  { path: '/counselor/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/counselor/appointments', icon: '📅', label: 'Appointments' },
  { path: '/counselor/resources', icon: '📚', label: 'Resources' },
  { path: '/counselor/profile', icon: '👤', label: 'My Profile' },
];

const adminNav = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/users', icon: '👥', label: 'Manage Users' },
  { path: '/admin/resources', icon: '📚', label: 'Resources' },
  { path: '/admin/profile', icon: '👤', label: 'My Profile' },
];

const roleNavMap = { student: studentNav, counselor: counselorNav, admin: adminNav };
const roleBadgeMap = { student: 'badge-primary', counselor: 'badge-success', admin: 'badge-warning' };

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = roleNavMap[user?.role] || studentNav;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="page-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🌿</div>
          <span className="logo-text">SoulHeal</span>
        </div>

        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="avatar">{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <span className={`badge ${roleBadgeMap[user?.role]}`} style={{ fontSize: '0.65rem', marginTop: '0.2rem' }}>{user?.role}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item w-full btn-secondary" onClick={handleLogout} style={{ border: 'none', width: '100%' }}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
