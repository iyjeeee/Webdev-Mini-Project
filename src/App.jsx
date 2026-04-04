import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Public pages
import Login          from './pages/login/login.jsx';
import ForgotPassword from './pages/login/forgotPassword.jsx';

// Layout wrapper
import Layout from './layouts/layout.jsx';

// Main pages
import Dashboard from './pages/dashboard/dashboard.jsx';
import Directory  from './pages/directory/directory.jsx';
import Attendance from './pages/attendance/attendance.jsx';
import Overtime   from './pages/overtime/overtime.jsx';
import Leave      from './pages/leave/leave.jsx';
import Tasks      from './pages/tasks/tasks.jsx';

// Reports
import Reports from './pages/reports/reports.jsx';

// Settings & profile
import Calendar  from './pages/calendar/calendar.jsx';
import EventType from './pages/eventType/eventType.jsx';
import AddEvent  from './pages/addEvent/addEvent.jsx';
import Profile   from './pages/profile/profile.jsx';

// ── Protected route guard ─────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"                element={<Login />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes — require auth + layout shell */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Main navigation */}
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/directory"  element={<Directory />} />
          <Route path="/attendance" element={<Attendance />} />

          {/* Task board — unified single table view */}
          <Route path="/tasks"       element={<Tasks />} />
          <Route path="/tasks/v1"    element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks/v2"    element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks/board" element={<Navigate to="/tasks" replace />} />

          {/* Other main pages */}
          <Route path="/overtime" element={<Overtime />} />
          <Route path="/leave"    element={<Leave />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* Settings & profile */}
          <Route path="/calendar"   element={<Calendar />} />
          <Route path="/event-type" element={<EventType />} />
          <Route path="/add-event"  element={<AddEvent />} />
          <Route path="/profile"    element={<Profile />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
