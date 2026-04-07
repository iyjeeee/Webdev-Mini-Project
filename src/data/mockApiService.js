// mockApiService.js — Guest-mode API interceptor
// Returns shaped mock responses identical to the real API contract so all
// existing pages work without any changes to their data-fetching logic.

import {
  MOCK_ATTENDANCE_LOGS,
  MOCK_CALENDAR_EVENTS,
  MOCK_DASHBOARD,
  MOCK_DEPARTMENTS,
  MOCK_EMPLOYEES,
  MOCK_EVENT_TYPES,
  MOCK_LEAVE_CREDITS,
  MOCK_LEAVE_REQUESTS,
  MOCK_LEAVE_TYPES,
  MOCK_NOTIFICATIONS,
  MOCK_OVERTIME_REQUESTS,
  MOCK_REQUEST_STATUSES,
  MOCK_TASKS,
} from './mockData.js';

// Simulated in-memory mutable store — cloned so originals are never mutated
let _attendance   = MOCK_ATTENDANCE_LOGS.map((r) => ({ ...r }));
let _calendar     = MOCK_CALENDAR_EVENTS.map((r) => ({ ...r }));
let _eventTypes   = MOCK_EVENT_TYPES.map((r)    => ({ ...r }));
let _leaves       = MOCK_LEAVE_REQUESTS.map((r) => ({ ...r }));
let _overtime     = MOCK_OVERTIME_REQUESTS.map((r) => ({ ...r }));
let _tasks        = MOCK_TASKS.map((r)           => ({ ...r }));
let _notifications= MOCK_NOTIFICATIONS.map((r)  => ({ ...r }));
let _nextId       = 100; // auto-increment for new mock records

// Helper — build a paginated response shape matching the real API
const paginate = (items, page = 1, pageSize = 10) => {
  const p     = parseInt(page,     10) || 1;
  const ps    = parseInt(pageSize, 10) || 10;
  const start = (p - 1) * ps;
  const slice = items.slice(start, start + ps);
  return {
    success: true,
    data: slice,
    pagination: { page: p, pageSize: ps, total: items.length, totalPages: Math.ceil(items.length / ps) },
  };
};

// Helper — success wrapper for single objects
const ok = (data) => ({ success: true, data });

// ── Auth ──────────────────────────────────────────────────────
export const mockLogin = () => Promise.resolve(ok({ token: 'guest', user: null }));

// ── Employee ──────────────────────────────────────────────────
export const mockGetProfile = () =>
  Promise.resolve(ok({ ...MOCK_EMPLOYEES[0], ...MOCK_DASHBOARD.profile }));

export const mockUpdateProfile = (data) => {
  // Merge updates into the profile snapshot (read-only in guest mode — just reflect the call)
  return Promise.resolve(ok({ ...MOCK_DASHBOARD.profile, ...data }));
};

export const mockGetDashboard = () =>
  Promise.resolve(ok({
    ...MOCK_DASHBOARD,
    todayAttendance: _attendance.find(
      (a) => a.employee_id === 1 && a.log_date === new Date().toISOString().split('T')[0]
    ) || null,
  }));

export const mockGetDirectory = () =>
  Promise.resolve(ok(MOCK_EMPLOYEES));

// ── Attendance ────────────────────────────────────────────────
export const mockGetAttendanceLogs = (params = {}) => {
  // date and day are computed display fields — attendance.jsx and attendanceSummary.jsx read log.date and log.day
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const enrichLog = (a) => {
    const d       = new Date(a.log_date);
    const fmtDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return {
      ...a,
      date: fmtDate,          // display date string expected by attendance table
      day:  DAYS[d.getDay()], // weekday name expected by attendance and attendanceSummary tables
      // Normalise time_in / time_out to readable "HH:MM AM/PM" for display
      time_in:  a.time_in  ? new Date(a.time_in).toLocaleTimeString('en-US',  { hour: '2-digit', minute: '2-digit' }) : null,
      time_out: a.time_out ? new Date(a.time_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
    };
  };

  let logs = _attendance.filter((a) => a.employee_id === 1);
  // Filter by month param (YYYY-MM) when provided — used by attendanceSummary tab
  if (params.month) logs = logs.filter((a) => a.log_date.startsWith(params.month));
  logs = logs
    .sort((a, b) => new Date(b.log_date) - new Date(a.log_date))
    .map(enrichLog);
  return Promise.resolve(paginate(logs, params.page, params.pageSize));
};

export const mockGetAttendanceStats = (params = {}) => {
  let myLogs = _attendance.filter((a) => a.employee_id === 1);
  // Filter by month param (YYYY-MM) when provided — attendanceSummary tab passes month
  if (params.month) myLogs = myLogs.filter((a) => a.log_date.startsWith(params.month));

  // working_days = business days in the target month (Mon–Fri); used by attendanceSummary stat card
  const targetDate  = params.month ? new Date(`${params.month}-01`) : new Date();
  const year        = targetDate.getFullYear();
  const month       = targetDate.getMonth();
  let workingDays   = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(year, month, d).getDay();
    if (day !== 0 && day !== 6) workingDays++; // exclude Sat/Sun
  }
  // total_hours sums hours_rendered for the period — attendanceSummary stat card
  const total_hours = parseFloat(
    myLogs.reduce((sum, a) => sum + parseFloat(a.hours_rendered || 0), 0).toFixed(2)
  );
  return Promise.resolve(ok({
    present:      myLogs.filter((a) => a.status === 'Present').length,
    absent:       0,          // no absences in mock data
    late:         myLogs.filter((a) => a.is_late).length,
    on_leave:     0,          // on_leave field expected by attendance.jsx "On Leave Days" stat card
    total:        myLogs.length,
    working_days: workingDays, // attendanceSummary "WORKING DAYS" card
    total_hours,               // attendanceSummary "TOTAL HOURS" card
  }));
};

export const mockGetTodayAttendance = () => {
  const today  = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const record = _attendance.find((a) => a.employee_id === 1 && a.log_date === today);
  if (!record) {
    // Return 404-style so AuthContext handles it correctly
    return Promise.reject(Object.assign(new Error('No attendance record for today'), { status: 404 }));
  }
  return Promise.resolve(ok(record));
};

export const mockTimeIn = () => {
  const today  = new Date().toISOString().split('T')[0];
  const exists = _attendance.find((a) => a.employee_id === 1 && a.log_date === today);
  if (exists) return Promise.reject(new Error('Already timed in today'));
  const record = {
    id: _nextId++, employee_id: 1, log_date: today,
    time_in: new Date().toISOString(), time_out: null,
    hours_rendered: 0, is_late: false, late_minutes: 0, status: 'Present', remarks: null,
  };
  _attendance.push(record);
  return Promise.resolve(ok(record));
};

export const mockTimeOut = () => {
  const today  = new Date().toISOString().split('T')[0];
  const record = _attendance.find((a) => a.employee_id === 1 && a.log_date === today);
  if (!record)        return Promise.reject(new Error('No time-in record found for today'));
  if (record.time_out) return Promise.reject(new Error('Already timed out today'));
  record.time_out = new Date().toISOString();
  const diffMs   = new Date(record.time_out) - new Date(record.time_in);
  record.hours_rendered = parseFloat((diffMs / 3600000).toFixed(2));
  return Promise.resolve(ok(record));
};

// ── Calendar ──────────────────────────────────────────────────
export const mockGetCalendarEvents = (params = {}) => {
  let events = [..._calendar];
  if (params.month) {
    events = events.filter((e) => e.start_date.startsWith(params.month));
  }
  return Promise.resolve(ok(events));
};

export const mockGetUpcomingEvents = () => {
  const today  = new Date().toISOString().split('T')[0];
  const upcoming = _calendar
    .filter((e) => e.start_date >= today && e.is_active)
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .slice(0, 5);
  return Promise.resolve(ok(upcoming));
};

export const mockCreateCalendarEvent = (payload) => {
  const newEvent = { id: _nextId++, is_active: true, ...payload };
  _calendar.push(newEvent);
  return Promise.resolve(ok(newEvent));
};

// ── Event Types ───────────────────────────────────────────────
export const mockGetEventTypes = (params = {}) =>
  Promise.resolve(paginate(_eventTypes, params.page, params.pageSize));

export const mockGetEventTypeStats = () => {
  // activeTypes and eventsThisMonth match field names expected by eventType.jsx stat cards
  const activeTypes      = _eventTypes.filter((e) => e.is_active).length;
  const thisMonth        = new Date().toISOString().slice(0, 7); // YYYY-MM
  const eventsThisMonth  = _calendar.filter((e) => e.start_date?.startsWith(thisMonth)).length;
  return Promise.resolve(ok({ total: _eventTypes.length, activeTypes, eventsThisMonth }));
};

export const mockCreateEventType = (payload) => {
  const newType = { id: _nextId++, is_active: true, created_at: new Date().toISOString(), ...payload };
  _eventTypes.push(newType);
  return Promise.resolve(ok(newType));
};

export const mockToggleEventType = (id) => {
  const idx = _eventTypes.findIndex((e) => e.id === parseInt(id, 10));
  if (idx === -1) return Promise.reject(new Error('Event type not found'));
  _eventTypes[idx].is_active = !_eventTypes[idx].is_active;
  return Promise.resolve(ok(_eventTypes[idx]));
};

// ── Leave ─────────────────────────────────────────────────────
export const mockGetLeaveRequests = (params = {}) => {
  let requests = _leaves
    .filter((l) => l.employee_id === 1)
    .sort((a, b) => new Date(b.filed_on) - new Date(a.filed_on));
  if (params.status) {
    requests = requests.filter((l) => l.status.toLowerCase() === params.status.toLowerCase());
  }
  return Promise.resolve(paginate(requests, params.page, params.pageSize));
};

export const mockGetLeaveCredits = () =>
  Promise.resolve(ok(MOCK_LEAVE_CREDITS));

export const mockGetLeaveStats = () => {
  const myLeaves   = _leaves.filter((l) => l.employee_id === 1);
  // usedThisYear sums number_of_days across approved leaves — matches leave.jsx "Used This Year" stat card
  const usedThisYear = myLeaves
    .filter((l) => l.status === 'Approved')
    .reduce((sum, l) => sum + (l.number_of_days || 0), 0);
  return Promise.resolve(ok({
    pending:     myLeaves.filter((l) => l.status === 'Pending').length,
    approved:    myLeaves.filter((l) => l.status === 'Approved').length,
    rejected:    myLeaves.filter((l) => l.status === 'Rejected').length,
    cancelled:   myLeaves.filter((l) => l.status === 'Cancelled').length,
    usedThisYear,
  }));
};

export const mockCreateLeaveRequest = (payload) => {
  const leaveType = MOCK_LEAVE_TYPES.find((t) => t.id === payload.leave_type_id);
  const typeName  = leaveType?.name || 'Leave';
  const newReq = {
    id: _nextId++,
    reference_no: `LR-GUEST-${_nextId}`,
    employee_id: 1,
    leave_type_name: typeName,
    leave_type:      typeName,  // alias — pages that read row.leave_type need this
    code: leaveType?.code || 'LV',
    status_id: 1, status: 'Pending',
    reviewed_by: null, reviewed_at: null, remarks: null,
    filed_on: new Date().toISOString(),
    ...payload,
  };
  _leaves.push(newReq);
  return Promise.resolve(ok(newReq));
};

export const mockCancelLeaveRequest = (id) => {
  const idx = _leaves.findIndex((l) => l.id === parseInt(id, 10));
  if (idx === -1) return Promise.reject(new Error('Leave request not found'));
  _leaves[idx].status_id = 4;
  _leaves[idx].status    = 'Cancelled';
  return Promise.resolve(ok(_leaves[idx]));
};

// ── Overtime ──────────────────────────────────────────────────
export const mockGetOvertimeRequests = (params = {}) => {
  let requests = _overtime
    .filter((o) => o.employee_id === 1)
    .sort((a, b) => new Date(b.filed_on) - new Date(a.filed_on));
  if (params.status) {
    requests = requests.filter((o) => o.status.toLowerCase() === params.status.toLowerCase());
  }
  return Promise.resolve(paginate(requests, params.page, params.pageSize));
};

export const mockGetOvertimeStats = () => {
  const myOT = _overtime.filter((o) => o.employee_id === 1);
  // total_hours_approved kept for backward compat; totalHours alias matches approvalOvertime.jsx stat card
  const total_hours_approved = myOT
    .filter((o) => o.status === 'Approved')
    .reduce((sum, o) => sum + parseFloat(o.total_hours || 0), 0);
  return Promise.resolve(ok({
    total:               myOT.length,                                           // overtime.jsx "Total Filed" card
    pending:             myOT.filter((o) => o.status === 'Pending').length,
    approved:            myOT.filter((o) => o.status === 'Approved').length,
    rejected:            myOT.filter((o) => o.status === 'Rejected').length,
    totalHours:          total_hours_approved,                                  // approvalOvertime.jsx "Total Hours" card
    total_hours_approved,                                                        // alias kept for future real API parity
  }));
};

export const mockCreateOvertimeRequest = (payload) => {
  const newReq = {
    id: _nextId++,
    reference_no: `OT-GUEST-${_nextId}`,
    employee_id: 1,
    status_id: 1, status: 'Pending',
    reviewed_by: null, reviewed_at: null, remarks: null,
    filed_on: new Date().toISOString(),
    ...payload,
  };
  _overtime.push(newReq);
  return Promise.resolve(ok(newReq));
};

export const mockCancelOvertimeRequest = (id) => {
  const idx = _overtime.findIndex((o) => o.id === parseInt(id, 10));
  if (idx === -1) return Promise.reject(new Error('Overtime request not found'));
  _overtime[idx].status_id = 4;
  _overtime[idx].status    = 'Cancelled';
  return Promise.resolve(ok(_overtime[idx]));
};

// ── Tasks ─────────────────────────────────────────────────────
export const mockGetTasks = (params = {}) => {
  let tasks = _tasks
    .filter((t) => t.employee_id === 1)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  if (params.status) {
    tasks = tasks.filter((t) => t.status.toLowerCase() === params.status.toLowerCase());
  }
  if (params.priority) {
    tasks = tasks.filter((t) => t.priority.toLowerCase() === params.priority.toLowerCase());
  }
  return Promise.resolve(paginate(tasks, params.page, params.pageSize));
};

export const mockCreateTask = (payload) => {
  const newTask = {
    id: _nextId++, employee_id: 1, assigned_by: 1,
    completed_at: null,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    assigned_by_name: 'John Andrei Recto',
    ...payload,
  };
  _tasks.push(newTask);
  return Promise.resolve(ok(newTask));
};

export const mockUpdateTask = (id, payload) => {
  const idx = _tasks.findIndex((t) => t.id === parseInt(id, 10));
  if (idx === -1) return Promise.reject(new Error('Task not found'));
  _tasks[idx] = {
    ..._tasks[idx],
    ...payload,
    updated_at: new Date().toISOString(),
    completed_at: payload.status === 'Completed' ? new Date().toISOString() : _tasks[idx].completed_at,
  };
  return Promise.resolve(ok(_tasks[idx]));
};

export const mockDeleteTask = (id) => {
  const idx = _tasks.findIndex((t) => t.id === parseInt(id, 10));
  if (idx === -1) return Promise.reject(new Error('Task not found'));
  _tasks.splice(idx, 1);
  return Promise.resolve(ok({ deleted: true }));
};

// ── Notifications ─────────────────────────────────────────────
export const mockGetNotifications = (params = {}) => {
  const sorted = [..._notifications].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return Promise.resolve(paginate(sorted, params.page, params.pageSize));
};

export const mockGetUnreadCount = () =>
  Promise.resolve(ok({ count: _notifications.filter((n) => !n.is_read).length }));

export const mockMarkAsRead = (id) => {
  const idx = _notifications.findIndex((n) => n.id === parseInt(id, 10));
  if (idx !== -1) _notifications[idx].is_read = true;
  return Promise.resolve(ok({ updated: true }));
};

export const mockMarkAllAsRead = () => {
  _notifications.forEach((n) => { n.is_read = true; });
  return Promise.resolve(ok({ updated: true }));
};
