import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// PUBLIC PAGES
import Login from './pages/login/login.jsx';
import ForgotPassword from './pages/login/forgotPassword.jsx'; 

// LAYOUT
import Layout from './layouts/layout.jsx';

// MAIN
import Dashboard from './pages/dashboard/dashboard.jsx';
import Directory  from './pages/directory/directory.jsx';
import Attendance from './pages/attendance/attendance.jsx';
import Overtime   from './pages/overtime/overtime.jsx';
import Leave      from './pages/leave/leave.jsx';

//REPORTS PAGE
import Reports from './pages/reports/reports.jsx';
// TASK BOARDS
import TaskBoardV1 from './pages/tasks/v1/TaskBoardV1.jsx';
import TaskBoardV2 from './pages/tasks/v2/TaskBoardV2.jsx';

// SETTINGS & PROFILE
import Calendar  from './pages/calendar/calendar.jsx';
import EventType from './pages/eventType/eventType.jsx';
import AddEvent  from './pages/addEvent/addEvent.jsx';
import Profile   from './pages/profile/profile.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/"               element={<Login />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<Layout />}>
          {/* Main Navigation */}
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/directory"  element={<Directory />} />
          <Route path="/attendance" element={<Attendance />} />

          {/* Task Board Routes */}
          <Route path="/tasks"      element={<Navigate to="/tasks/v1" replace />} />
          <Route path="/tasks/v1"   element={<TaskBoardV1 />} />
          <Route path="/tasks/v2"   element={<TaskBoardV2 />} />

          <Route path="/overtime"   element={<Overtime />} />
          <Route path="/leave"      element={<Leave />} />
          
          {/* Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* Settings & Profile */}
          <Route path="/calendar"    element={<Calendar />} />
          <Route path="/event-type"  element={<EventType />} />
          <Route path="/add-event"   element={<AddEvent />} />
          <Route path="/profile"     element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
