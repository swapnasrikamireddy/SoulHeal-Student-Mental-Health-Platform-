import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import MoodTracker from './pages/student/MoodTracker';
import Assessment from './pages/student/Assessment';
import AssessmentResult from './pages/student/AssessmentResult';
import Appointments from './pages/student/Appointments';
import Resources from './pages/student/Resources';
import Profile from './pages/student/Profile';
import CounselorDashboard from './pages/counselor/Dashboard';
import CounselorAppointments from './pages/counselor/Appointments';
import StudentDetail from './pages/counselor/StudentDetail';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminResources from './pages/admin/Resources';
import Layout from './components/Layout';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'counselor') return <Navigate to="/counselor/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

    {/* Student */}
    <Route path="/student" element={<PrivateRoute roles={['student']}><Layout /></PrivateRoute>}>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="mood" element={<MoodTracker />} />
      <Route path="assessment" element={<Assessment />} />
      <Route path="assessment/result/:id" element={<AssessmentResult />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="resources" element={<Resources />} />
      <Route path="profile" element={<Profile />} />
    </Route>

    {/* Counselor */}
    <Route path="/counselor" element={<PrivateRoute roles={['counselor']}><Layout /></PrivateRoute>}>
      <Route path="dashboard" element={<CounselorDashboard />} />
      <Route path="appointments" element={<CounselorAppointments />} />
      <Route path="student/:id" element={<StudentDetail />} />
      <Route path="profile" element={<Profile />} />
      <Route path="resources" element={<Resources />} />
    </Route>

    {/* Admin */}
    <Route path="/admin" element={<PrivateRoute roles={['admin']}><Layout /></PrivateRoute>}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="resources" element={<AdminResources />} />
      <Route path="profile" element={<Profile />} />
    </Route>

    <Route path="/unauthorized" element={<div className="page-loader"><h2>🚫 Unauthorized</h2></div>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#111118', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
