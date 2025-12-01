import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardLayout } from './components/Layout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient Pages
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';

// Doctor Pages
import DoctorAppointments from './pages/doctor/DoctorAppointments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageUsers from './pages/admin/ManageUsers';

// Shared Pages
import Profile from './pages/Profile';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const DashboardHomeRouter = () => {
    const { user } = useAuth();
    if(user?.role === 'admin') return <AdminDashboard />;
    if(user?.role === 'doctor') return <DoctorAppointments />; // Doctor landing
    return <div className="p-8"><h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1><p className="text-gray-600">Select an action from the sidebar to get started.</p></div>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          
          {/* Patient Routes */}
          <Route path="/dashboard/book" element={
             <ProtectedRoute allowedRoles={['user']}><BookAppointment /></ProtectedRoute>
          } />
          <Route path="/dashboard/my-appointments" element={
             <ProtectedRoute allowedRoles={['user', 'doctor']}><MyAppointments /></ProtectedRoute>
          } />
          
          {/* Doctor Routes */}
          {/* Note: MyAppointments re-used for doctor to see history, but DoctorAppointments is the main management view */}
          
          {/* Admin Routes */}
          <Route path="/dashboard/doctors" element={
             <ProtectedRoute allowedRoles={['admin']}><ManageDoctors /></ProtectedRoute>
          } />
          <Route path="/dashboard/users" element={
             <ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>
          } />
          <Route path="/dashboard/appointments" element={
             <ProtectedRoute allowedRoles={['admin']}><DoctorAppointments /></ProtectedRoute>
          } />

          {/* Shared */}
          <Route path="/dashboard/profile" element={
             <ProtectedRoute allowedRoles={['user', 'doctor', 'admin']}><Profile /></ProtectedRoute>
          } />

          {/* Dashboard Home - Fallback for /dashboard */}
          <Route path="/dashboard" element={
             <ProtectedRoute allowedRoles={['user', 'doctor', 'admin']}><DashboardHomeRouter /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}