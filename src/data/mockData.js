// mockData.js — Static guest-mode data mirroring the PostgreSQL schema
// All data is derived from mini_project.sql seed values.
// Used when the user proceeds as a guest (no live API calls are made).

// ── Departments ───────────────────────────────────────────────
export const MOCK_DEPARTMENTS = [
  { id: 1, name: 'Information Technology', is_active: true },
  { id: 2, name: 'Human Resources',        is_active: true },
  { id: 3, name: 'Finance',                is_active: true },
  { id: 4, name: 'Operations',             is_active: true },
  { id: 5, name: 'Marketing',              is_active: true },
];

// ── Job Positions ─────────────────────────────────────────────
export const MOCK_JOB_POSITIONS = [
  { id: 1, title: 'Junior Software Developer',  department_id: 1 },
  { id: 2, title: 'Senior Software Developer',  department_id: 1 },
  { id: 3, title: 'Project Management Head',    department_id: 1 },
  { id: 4, title: 'HR Officer',                 department_id: 2 },
  { id: 5, title: 'HR Manager',                 department_id: 2 },
  { id: 6, title: 'Finance Analyst',            department_id: 3 },
  { id: 7, title: 'Operations Manager',         department_id: 4 },
  { id: 8, title: 'Marketing Specialist',       department_id: 5 },
];

// ── Employees ─────────────────────────────────────────────────
export const MOCK_EMPLOYEES = [
  {
    id: 1, employee_no: 'HS-001',
    first_name: 'John Andrei', last_name: 'Recto',   middle_name: 'Santos',
    full_name: 'John Andrei Santos Recto',
    job_position: 'Junior Software Developer', job_position_id: 1,
    department: 'Information Technology',      department_id: 1,
    work_arrangement: 'On-site',  civil_status: 'Single',
    birth_date: '2002-05-14',     contact_number: '09171234567',
    residence_address: 'Batangas City, Batangas',
    personal_email: 'john.recto@gmail.com',
    company_email:  'john.andrei.recto@highlysucceed.com',
    profile_photo_url: null,
    date_hired: '2024-01-10', date_regularized: '2024-07-10',
    is_active: true,
    sss_number: '34-5678901-2', philhealth_number: '12-345678901-3',
    pagibig_number: '1234-5678-9012', tin_number: '123-456-789-001',
    last_login: '2026-04-04T10:22:51+08:00',
  },
  {
    id: 2, employee_no: 'HS-002',
    first_name: 'Marcus Neo',  last_name: 'Rangel', middle_name: 'Lopez',
    full_name: 'Marcus Neo Lopez Rangel',
    job_position: 'Junior Software Developer', job_position_id: 1,
    department: 'Information Technology',      department_id: 1,
    work_arrangement: 'Hybrid',   civil_status: 'Single',
    birth_date: '2001-09-21',     contact_number: '09181234567',
    residence_address: 'Lipa City, Batangas',
    personal_email: 'marcus.rangel@gmail.com',
    company_email:  'marcus.neo.rangel@highlysucceed.com',
    profile_photo_url: null,
    date_hired: '2023-11-05', date_regularized: '2024-05-05',
    is_active: true,
    sss_number: '34-6789012-3', philhealth_number: '12-456789012-4',
    pagibig_number: '2345-6789-0123', tin_number: '234-567-890-002',
    last_login: null,
  },
  {
    id: 3, employee_no: 'HS-003',
    first_name: 'Renson',    last_name: 'Pena',   middle_name: 'Garcia',
    full_name: 'Renson Garcia Pena',
    job_position: 'Junior Software Developer', job_position_id: 1,
    department: 'Information Technology',      department_id: 1,
    work_arrangement: 'Remote',   civil_status: 'Single',
    birth_date: '2000-12-11',     contact_number: '09191234567',
    residence_address: 'Tanauan City, Batangas',
    personal_email: 'renson.pena@gmail.com',
    company_email:  'renson.pena@highlysucceed.com',
    profile_photo_url: null,
    date_hired: '2024-02-01', date_regularized: '2024-08-01',
    is_active: true,
    sss_number: '34-7890123-4', philhealth_number: '12-567890123-5',
    pagibig_number: '3456-7890-1234', tin_number: '345-678-901-003',
    last_login: null,
  },
  {
    id: 4, employee_no: 'HS-004',
    first_name: 'Ken Demetri', last_name: 'Payo',  middle_name: 'Reyes',
    full_name: 'Ken Demetri Reyes Payo',
    job_position: 'Junior Software Developer', job_position_id: 1,
    department: 'Information Technology',      department_id: 1,
    work_arrangement: 'On-site',  civil_status: 'Single',
    birth_date: '2002-03-08',     contact_number: '09201234567',
    residence_address: 'Sto. Tomas, Batangas',
    personal_email: 'ken.payo@gmail.com',
    company_email:  'ken.demetri.payo@highlysucceed.com',
    profile_photo_url: null,
    date_hired: '2024-01-20', date_regularized: '2024-07-20',
    is_active: true,
    sss_number: '34-8901234-5', philhealth_number: '12-678901234-6',
    pagibig_number: '4567-8901-2345', tin_number: '456-789-012-004',
    last_login: null,
  },
  {
    id: 5, employee_no: 'HS-005',
    first_name: 'Rosh Andrei', last_name: 'Lantin', middle_name: 'Mendoza',
    full_name: 'Rosh Andrei Mendoza Lantin',
    job_position: 'Project Management Head',   job_position_id: 3,
    department: 'Information Technology',      department_id: 1,
    work_arrangement: 'Hybrid',   civil_status: 'Single',
    birth_date: '2001-07-30',     contact_number: '09211234567',
    residence_address: 'Batangas City, Batangas',
    personal_email: 'rosh.lantin@gmail.com',
    company_email:  'rosh.andrei.lantin@highlysucceed.com',
    profile_photo_url: null,
    date_hired: '2023-10-15', date_regularized: '2024-04-15',
    is_active: true,
    sss_number: '34-9012345-6', philhealth_number: '12-789012345-7',
    pagibig_number: '5678-9012-3456', tin_number: '567-890-123-005',
    last_login: null,
  },
];

// ── Guest user — mirrors employee #1 ─────────────────────────
export const MOCK_GUEST_USER = {
  id:          0,          // sentinel — 0 = guest
  employeeId:  1,
  firstName:   'John Andrei',
  lastName:    'Recto',
  email:       'john.andrei.recto@highlysucceed.com',
  jobPosition: 'Junior Software Developer',
  department:  'Information Technology',
  isGuest:     true,
};

// ── Attendance Logs ───────────────────────────────────────────
export const MOCK_ATTENDANCE_LOGS = [
  {
    id: 1,  employee_id: 1, log_date: '2026-04-01',
    time_in:  '2026-04-01T08:02:00+08:00',
    time_out: '2026-04-01T17:00:00+08:00',
    hours_rendered: 8.00, is_late: false, late_minutes: 0,
    status: 'Present', remarks: null,
  },
  {
    id: 6,  employee_id: 1, log_date: '2026-04-02',
    time_in:  '2026-04-02T08:00:00+08:00',
    time_out: '2026-04-02T17:00:00+08:00',
    hours_rendered: 8.00, is_late: false, late_minutes: 0,
    status: 'Present', remarks: null,
  },
  {
    id: 2,  employee_id: 2, log_date: '2026-04-01',
    time_in:  '2026-04-01T08:00:00+08:00',
    time_out: '2026-04-01T17:30:00+08:00',
    hours_rendered: 8.50, is_late: false, late_minutes: 0,
    status: 'Present', remarks: null,
  },
  {
    id: 7,  employee_id: 2, log_date: '2026-04-02',
    time_in:  '2026-04-02T08:10:00+08:00',
    time_out: '2026-04-02T17:30:00+08:00',
    hours_rendered: 8.33, is_late: true, late_minutes: 10,
    status: 'Present', remarks: null,
  },
  {
    id: 3,  employee_id: 3, log_date: '2026-04-01',
    time_in:  '2026-04-01T08:15:00+08:00',
    time_out: '2026-04-01T17:00:00+08:00',
    hours_rendered: 7.75, is_late: true, late_minutes: 15,
    status: 'Present', remarks: 'Slight traffic delay',
  },
  {
    id: 8,  employee_id: 3, log_date: '2026-04-02',
    time_in:  '2026-04-02T08:00:00+08:00',
    time_out: '2026-04-02T17:00:00+08:00',
    hours_rendered: 8.00, is_late: false, late_minutes: 0,
    status: 'Present', remarks: null,
  },
  {
    id: 4,  employee_id: 4, log_date: '2026-04-01',
    time_in:  '2026-04-01T08:00:00+08:00',
    time_out: '2026-04-01T17:00:00+08:00',
    hours_rendered: 8.00, is_late: false, late_minutes: 0,
    status: 'Present', remarks: null,
  },
  {
    id: 9,  employee_id: 4, log_date: '2026-04-02',
    time_in:  '2026-04-02T08:00:00+08:00',
    time_out: '2026-04-02T17:15:00+08:00',
    hours_rendered: 8.25, is_late: false, late_minutes: 0,
    status: 'Present', remarks: null,
  },
  {
    id: 5,  employee_id: 5, log_date: '2026-04-01',
    time_in:  '2026-04-01T09:05:00+08:00',
    time_out: '2026-04-01T18:05:00+08:00',
    hours_rendered: 8.00, is_late: true, late_minutes: 65,
    status: 'Present', remarks: 'Late — bus issue',
  },
  {
    id: 10, employee_id: 5, log_date: '2026-04-02',
    time_in:  '2026-04-02T08:30:00+08:00',
    time_out: '2026-04-02T17:30:00+08:00',
    hours_rendered: 8.00, is_late: true, late_minutes: 30,
    status: 'Present', remarks: null,
  },
];

// ── Event Types ───────────────────────────────────────────────
export const MOCK_EVENT_TYPES = [
  { id: 1, name: 'Holiday',            color: '#3B82F6', is_active: true, created_at: '2026-04-04T10:22:05+08:00' },
  { id: 2, name: 'Company Event',      color: '#EAB308', is_active: true, created_at: '2026-04-04T10:22:05+08:00' },
  { id: 3, name: 'Payroll',            color: '#22C55E', is_active: true, created_at: '2026-04-04T10:22:05+08:00' },
  { id: 4, name: 'Training',           color: '#A855F7', is_active: true, created_at: '2026-04-04T10:22:05+08:00' },
  { id: 5, name: 'Deadline',           color: '#EF4444', is_active: true, created_at: '2026-04-04T10:22:05+08:00' },
  { id: 6, name: 'HR Event',           color: '#84CC16', is_active: true, created_at: '2026-04-04T10:22:05+08:00' },
  { id: 7, name: 'Department Meeting', color: '#06B6D4', is_active: true, created_at: '2026-04-04T10:22:05+08:00' },
];

// ── Calendar Events ───────────────────────────────────────────
export const MOCK_CALENDAR_EVENTS = [
  {
    id: 1, title: 'Good Friday', event_type_id: 1,
    start_date: '2026-04-03', end_date: '2026-04-03',
    start_time: null, end_time: null,
    is_all_day: true, location: 'N/A',
    description: 'National Holiday — Holy Week',
    is_active: true, event_type_name: 'Holiday', event_type_color: '#3B82F6',
  },
  {
    id: 4, title: 'IT Department Sprint Planning', event_type_id: 7,
    start_date: '2026-04-01', end_date: '2026-04-01',
    start_time: '09:00:00', end_time: '11:00:00',
    is_all_day: false, location: 'IT Room',
    description: 'Sprint 14 planning session',
    is_active: true, event_type_name: 'Department Meeting', event_type_color: '#06B6D4',
  },
  {
    id: 5, title: 'April Payroll Cutoff', event_type_id: 3,
    start_date: '2026-04-15', end_date: '2026-04-15',
    start_time: null, end_time: null,
    is_all_day: true, location: 'N/A',
    description: 'Payroll cutoff for April 1–15',
    is_active: true, event_type_name: 'Payroll', event_type_color: '#22C55E',
  },
  {
    id: 6, title: 'Team Building Day', event_type_id: 2,
    start_date: '2026-04-20', end_date: '2026-04-20',
    start_time: '08:00:00', end_time: '17:00:00',
    is_all_day: false, location: 'Batangas Venue',
    description: 'Annual company-wide team building activity',
    is_active: true, event_type_name: 'Company Event', event_type_color: '#EAB308',
  },
];

// ── Leave Types ───────────────────────────────────────────────
export const MOCK_LEAVE_TYPES = [
  { id: 1, name: 'Vacation Leave',   code: 'VL', default_days: 15, is_active: true },
  { id: 2, name: 'Sick Leave',       code: 'SL', default_days: 15, is_active: true },
  { id: 3, name: 'Emergency Leave',  code: 'EL', default_days: 3,  is_active: true },
];

// ── Request Statuses ──────────────────────────────────────────
export const MOCK_REQUEST_STATUSES = [
  { id: 1, name: 'Pending' },
  { id: 2, name: 'Approved' },
  { id: 3, name: 'Rejected' },
  { id: 4, name: 'Cancelled' },
];

// ── Leave Credits (for guest / employee #1) ───────────────────
// leave_type mirrors leave_type_name; remaining_days mirrors remaining — both aliases kept for page compatibility
export const MOCK_LEAVE_CREDITS = [
  { id: 1, employee_id: 1, leave_type_id: 1, leave_type_name: 'Vacation Leave',  leave_type: 'Vacation Leave',  code: 'VL', total_days: 15, used_days: 2,  remaining: 13, remaining_days: 13 },
  { id: 2, employee_id: 1, leave_type_id: 2, leave_type_name: 'Sick Leave',       leave_type: 'Sick Leave',       code: 'SL', total_days: 15, used_days: 1,  remaining: 14, remaining_days: 14 },
  { id: 3, employee_id: 1, leave_type_id: 3, leave_type_name: 'Emergency Leave',  leave_type: 'Emergency Leave',  code: 'EL', total_days: 3,  used_days: 0,  remaining: 3,  remaining_days: 3  },
];

// ── Leave Requests ────────────────────────────────────────────
// leave_type aliases leave_type_name — pages use both field names
export const MOCK_LEAVE_REQUESTS = [
  {
    id: 1, reference_no: 'LR-2026-APR-001', employee_id: 1,
    leave_type_id: 1, leave_type_name: 'Vacation Leave', leave_type: 'Vacation Leave', code: 'VL',
    date_from: '2026-04-14', date_to: '2026-04-15', number_of_days: 2,
    reason: 'Family vacation trip',
    status_id: 2, status: 'Approved',
    reviewed_by: 5, reviewed_at: '2026-04-10T10:00:00+08:00',
    remarks: 'Approved — enjoy your break!',
    filed_on: '2026-04-05T09:00:00+08:00',
  },
  {
    id: 2, reference_no: 'LR-2026-APR-002', employee_id: 1,
    leave_type_id: 2, leave_type_name: 'Sick Leave', leave_type: 'Sick Leave', code: 'SL',
    date_from: '2026-04-08', date_to: '2026-04-08', number_of_days: 1,
    reason: 'Fever and headache',
    status_id: 1, status: 'Pending',
    reviewed_by: null, reviewed_at: null,
    remarks: null,
    filed_on: '2026-04-07T08:30:00+08:00',
  },
];

// ── Overtime Requests ─────────────────────────────────────────
export const MOCK_OVERTIME_REQUESTS = [
  {
    id: 1, reference_no: 'OT-2026-APR-001', employee_id: 1,
    ot_date: '2026-04-01', ot_start: '18:00:00', ot_end: '21:00:00',
    total_hours: 3.00,
    reason: 'HRIS Sprint 14 backend integration — urgent deployment',
    status_id: 2, status: 'Approved',
    reviewed_by: 5, reviewed_at: '2026-04-01T21:30:00+08:00',
    remarks: 'Approved', filed_on: '2026-04-01T17:50:00+08:00',
  },
  {
    id: 3, reference_no: 'OT-2026-APR-003', employee_id: 1,
    ot_date: '2026-04-05', ot_start: '18:00:00', ot_end: '20:30:00',
    total_hours: 2.50,
    reason: 'Frontend bug fixes for client demo',
    status_id: 1, status: 'Pending',
    reviewed_by: null, reviewed_at: null,
    remarks: null, filed_on: '2026-04-05T17:45:00+08:00',
  },
];

// ── Tasks ─────────────────────────────────────────────────────
export const MOCK_TASKS = [
  {
    id: 1, employee_id: 1, assigned_by: 5,
    title: 'Implement JWT Authentication',
    description: 'Set up secure JWT token generation and refresh token logic for all API endpoints.',
    project_name: 'HRIS System v2', priority: 'High', status: 'Completed',
    due_date: '2026-04-05', completed_at: '2026-04-04T16:30:00+08:00',
    created_at: '2026-04-01T08:00:00+08:00', updated_at: '2026-04-04T16:30:00+08:00',
    assigned_by_name: 'Rosh Andrei Lantin',
  },
  {
    id: 16, employee_id: 1, assigned_by: 5,
    title: 'Write Unit Tests for Auth Module',
    description: 'Write Jest unit tests for login, refresh, and logout flows.',
    project_name: 'HRIS System v2', priority: 'Medium', status: 'In Progress',
    due_date: '2026-04-12', completed_at: null,
    created_at: '2026-04-02T09:00:00+08:00', updated_at: '2026-04-05T08:00:00+08:00',
    assigned_by_name: 'Rosh Andrei Lantin',
  },
  {
    id: 17, employee_id: 1, assigned_by: 5,
    title: 'Fix Leave Request Pagination Bug',
    description: 'Pagination resets to page 1 on filter change — investigate and fix.',
    project_name: 'HRIS System v2', priority: 'High', status: 'To Do',
    due_date: '2026-04-09', completed_at: null,
    created_at: '2026-04-03T08:00:00+08:00', updated_at: '2026-04-03T08:00:00+08:00',
    assigned_by_name: 'Rosh Andrei Lantin',
  },
  {
    id: 18, employee_id: 1, assigned_by: 5,
    title: 'Attendance Summary Report Export',
    description: 'Add CSV export button to the attendance summary report tab.',
    project_name: 'HR Admin', priority: 'Low', status: 'Overdue',
    due_date: '2026-04-04', completed_at: null,
    created_at: '2026-04-01T09:00:00+08:00', updated_at: '2026-04-01T09:00:00+08:00',
    assigned_by_name: 'Rosh Andrei Lantin',
  },
];

// ── Notifications ─────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  {
    id: 3, employee_id: 1,
    title: 'Overtime Approved',
    body:  'Your overtime on Apr 1 (3 hrs) has been approved.',
    type: 'overtime', reference_id: 1,
    is_read: false, created_at: '2026-04-01T21:35:00+08:00',
  },
  {
    id: 10, employee_id: 1,
    title: 'Leave Request Approved',
    body:  'Your Vacation Leave (Apr 14–15) has been approved.',
    type: 'leave', reference_id: 1,
    is_read: false, created_at: '2026-04-10T10:05:00+08:00',
  },
  {
    id: 11, employee_id: 1,
    title: 'New Task Assigned',
    body:  'You have been assigned: Write Unit Tests for Auth Module — due Apr 12.',
    type: 'task', reference_id: 16,
    is_read: true, created_at: '2026-04-02T09:05:00+08:00',
  },
  {
    id: 12, employee_id: 1,
    title: 'Team Building — April 20',
    body:  'Company team building is scheduled for April 20. Mark your calendars!',
    type: 'calendar', reference_id: 6,
    is_read: true, created_at: '2026-04-03T10:00:00+08:00',
  },
];

// ── Dashboard summary (guest/employee #1) ─────────────────────
export const MOCK_DASHBOARD = {
  profile: {
    id: 1, employee_no: 'HS-001',
    full_name:      'John Andrei Santos Recto',
    job_position:   'Junior Software Developer',
    department:     'Information Technology',
    company_email:  'john.andrei.recto@highlysucceed.com',
    work_arrangement: 'On-site',
    date_hired:     '2024-01-10',
    date_regularized: '2024-07-10',
    profile_photo_url: null,
    last_login: '2026-04-04T10:22:51+08:00',
  },
  stats: {
    present_this_month:   8,
    absent_this_month:    0,
    late_this_month:      0,
    leave_pending:        1,
    overtime_pending:     1,
    tasks_in_progress:    1,
    tasks_overdue:        1,
  },
};
