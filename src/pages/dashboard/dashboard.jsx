import React, { useState, useEffect, useCallback } from 'react';
import StatCard from '../../components/statCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDashboard } from '../../api/employeeApi.js';
import { getUpcomingEvents } from '../../api/calendarApi.js';

const fmtTime = (str) => {
  if (!str) return '-- : --';
  // str comes from DB already formatted as "HH:MI AM" — return as-is
  return str;
};

const daysSince = (dateStr) => {
  if (!dateStr) return null;
  const hired = new Date(dateStr);
  const now   = new Date();
  const days  = Math.floor((now - hired) / 86400000);
  const months = Math.floor(days / 30);
  const remDays = days % 30;
  if (months === 0) return `${days} Day${days !== 1 ? 's' : ''}`;
  return `${months} Month${months !== 1 ? 's' : ''} & ${remDays} Day${remDays !== 1 ? 's' : ''}`;
};

const Dashboard = () => {
  const { user, todayAttendance, attLoading, fetchTodayAttendance, doTimeIn, doTimeOut } = useAuth();

  const [dashboard,      setDashboard]      = useState(null);
  const [upcomingEvents, setUpcomingEvents]  = useState([]);
  const [dashLoading,    setDashLoading]     = useState(true);
  const [eventsLoading,  setEventsLoading]   = useState(true);
  const [timeActionError,setTimeActionError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setDashLoading(true);
    try { const res = await getDashboard(); setDashboard(res.data); }
    catch { /* show defaults */ }
    finally { setDashLoading(false); }
  }, []);

  const fetchUpcoming = useCallback(async () => {
    setEventsLoading(true);
    try { const res = await getUpcomingEvents(); setUpcomingEvents(res.data || []); }
    catch { /* non-critical */ }
    finally { setEventsLoading(false); }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchTodayAttendance();
    fetchUpcoming();
  }, [fetchDashboard, fetchTodayAttendance, fetchUpcoming]);

  const handleTimeIn = async () => {
    setTimeActionError(null);
    const result = await doTimeIn();
    if (!result.success) setTimeActionError(result.message);
    else { fetchDashboard(); }
  };

  const handleTimeOut = async () => {
    setTimeActionError(null);
    const result = await doTimeOut();
    if (!result.success) setTimeActionError(result.message);
    else { fetchDashboard(); }
  };

  const hasTimeIn  = !!todayAttendance?.time_in;
  const hasTimeOut = !!todayAttendance?.time_out;
  const isComplete = hasTimeIn && hasTimeOut;

  const profile     = dashboard?.profile;
  const displayName = profile?.full_name  || (user ? `${user.firstName} ${user.lastName}` : 'Employee');
  const email       = profile?.company_email || user?.email || '';
  const initials    = displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const jobPosition = profile?.job_position || user?.jobPosition || 'Employee';
  const department  = profile?.department   || user?.department  || '';
  const dateHired   = profile?.date_hired   || null;
  const period      = daysSince(dateHired);
  const hiredStr    = dateHired
    ? new Date(dateHired).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  const leaveSummary = dashboard?.leaveSummary || [];
  const getLeaveData = (name) => leaveSummary.find((l) => l.leave_type === name) || { used_days: 0, total_days: 0 };
  const vacLeave  = getLeaveData('Vacation Leave');
  const sickLeave = getLeaveData('Sick Leave');
  const emgLeave  = getLeaveData('Emergency Leave');
  const totalAvail = leaveSummary.reduce((a, l) => a + Math.max(0, (l.total_days || 0) - (l.used_days || 0)), 0);

  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 pb-10">

      {/* Hero: Welcome + Quick Attendance */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center gap-0">

        {/* Left: User Welcome */}
        <div className="flex-1 flex gap-6 items-center border-r-2 border-gray-300 pr-12 h-full py-2">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-[#FBC02D] font-bold text-2xl shrink-0 shadow-sm">
            {dashLoading ? '?' : initials}
          </div>
          <div className="space-y-4">
            <div>
              {dashLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-6 bg-gray-100 rounded w-40" />
                  <div className="h-4 bg-gray-100 rounded w-56" />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">{displayName}</h2>
                  <p className="text-xs text-gray-400 font-medium">{email}</p>
                </>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-[#00C853] text-white text-[10px] font-bold px-4 py-1.5 rounded-md flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div> Active
              </span>
              {period && (
                <span className="bg-[#E0E0E0] text-[#424242] text-[10px] font-bold px-4 py-1.5 rounded-md">
                  Period: {period}
                </span>
              )}
              {dateHired && (
                <span className="bg-[#E0E0E0] text-[#424242] text-[10px] font-bold px-4 py-1.5 rounded-md">
                  Hired: {hiredStr}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Attendance */}
        <div className="lg:w-[550px] flex items-center pl-12 py-2">
          <div className="w-full flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                  Today's Attendance — {todayLabel}
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${isComplete ? 'bg-[#00C853]' : hasTimeIn ? 'bg-[#FBC02D]' : 'bg-[#D32F2F]'}`}></div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {isComplete ? 'Logged Out' : hasTimeIn ? 'Currently Logged In' : 'Not yet logged in'}
                  </h3>
                </div>
                {timeActionError && (
                  <p className="text-[11px] text-red-500 font-medium">{timeActionError}</p>
                )}
                {!timeActionError && (
                  <p className="text-[11px] text-gray-500">
                    {isComplete
                      ? 'Your attendance is complete for today.'
                      : hasTimeIn
                      ? 'Click TIME OUT when you are done for the day.'
                      : <>Click <span className="font-bold text-gray-700">TIME IN</span> to record your time-in</>
                    }
                  </p>
                )}
              </div>

              <div className="flex gap-10 pt-1">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Time In</p>
                  <p className={`text-sm font-bold ${hasTimeIn ? 'text-gray-900' : 'text-gray-300'}`}>
                    {hasTimeIn ? fmtTime(todayAttendance.time_in) : '-- : --'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Time Out</p>
                  <p className={`text-sm font-bold ${hasTimeOut ? 'text-gray-900' : 'text-gray-300'}`}>
                    {hasTimeOut ? fmtTime(todayAttendance.time_out) : '-- : --'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Hours Rendered</p>
                  <p className="text-sm font-bold text-gray-900">
                    {todayAttendance?.hours_rendered ? `${todayAttendance.hours_rendered}h` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {!isComplete && (
              <button
                onClick={hasTimeIn ? handleTimeOut : handleTimeIn}
                disabled={attLoading}
                className="bg-[#FFB300] hover:bg-[#FFA000] text-white px-8 py-3.5 rounded-2xl font-bold text-[11px] uppercase shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 ml-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {attLoading ? '...' : hasTimeIn ? 'Time Out' : 'Time In Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200">
        <StatCard value={totalAvail}                       label="Available Leave Credits" description={`${new Date().getFullYear()} Allocation`} />
        <StatCard value={dashboard?.presentThisMonth ?? 0} label="Days Present This Month" description={`${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`} />
        <StatCard value={dashboard?.pendingOt ?? 0}        label="Overtime This Month"     description="Pending Approval" />
        <StatCard value={dashboard?.pendingTasks ?? 0}     label="Pending Tasks"           description="Due This Week" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Upcoming Events only (Announcements removed) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Upcoming Events</h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                {new Date().toLocaleString('default', { month: 'long' })}
              </span>
            </div>
            <div className="p-4 space-y-4">
              {eventsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No upcoming events.</p>
              ) : (
                upcomingEvents.map((ev) => {
                  const d   = new Date(ev.start_date);
                  const day = (d.getUTCDate()).toString().padStart(2, '0');
                  const mon = d.toLocaleString('default', { month: 'short', timeZone: 'UTC' }).toUpperCase();
                  return (
                    <EventItem key={ev.id} day={day} month={mon}
                      title={ev.title} subtitle={ev.event_type_name || ''}
                      color={ev.event_type_color}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Leave & OT Summary */}
        <div className="lg:col-span-4 space-y-6">

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{new Date().getFullYear()} Leave Credits</h3>
              <span className="text-[10px] border border-gray-200 px-2 py-0.5 rounded text-gray-400 font-bold">Active</span>
            </div>
            <div className="space-y-6">
              <LeaveProgress label="Vacation Leave"  used={vacLeave.used_days}  total={vacLeave.total_days  || 15} />
              <LeaveProgress label="Sick Leave"       used={sickLeave.used_days} total={sickLeave.total_days || 15} />
              <LeaveProgress label="Emergency Leave"  used={emgLeave.used_days}  total={emgLeave.total_days  || 3}  />
              <div className="flex justify-between pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase">
                <span>Available: {totalAvail}</span>
                <span>Used: {leaveSummary.reduce((a, l) => a + (l.used_days || 0), 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Overtime Summary</h3>
              <span className="text-[10px] border border-gray-200 px-2 py-0.5 rounded text-gray-400 font-bold">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <div className="p-4 space-y-4">
              <SummaryRow label="Total Filed OT"  value={dashboard?.otSummary?.total_hours    ? `${dashboard.otSummary.total_hours}h`    : '0h'} />
              <SummaryRow label="Approved OT"      value={dashboard?.otSummary?.approved_hours  ? `${dashboard.otSummary.approved_hours}h`  : '0h'} />
              <SummaryRow label="Pending Approval" value={dashboard?.pendingOt  ?? 0} />
              <SummaryRow label="Rejected"         value={dashboard?.otSummary?.rejected ?? 0} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const EventItem = ({ day, month, title, subtitle, color }) => {
  const isDark = !color || color === '#000000';
  return (
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center border shrink-0 ${isDark ? 'bg-black border-black text-white' : ''}`}
        style={!isDark ? { backgroundColor: color + '18', border: `1.5px solid ${color}40` } : {}}
      >
        <span className="text-lg font-bold leading-none" style={!isDark ? { color } : {}}>{day}</span>
        <span className="text-[9px] font-bold" style={!isDark ? { color } : {}}>{month}</span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-[10px] text-gray-400 font-bold uppercase">{subtitle}</p>
      </div>
    </div>
  );
};

const LeaveProgress = ({ label, used, total }) => {
  const safePct = total > 0 ? Math.min(100, ((used || 0) / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-[11px] font-bold mb-2">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-400">{used || 0}/{total} days</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="bg-gray-900 h-full rounded-full" style={{ width: `${safePct}%` }}></div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{label}</span>
    <span className="text-sm font-bold text-gray-800">{value}</span>
  </div>
);

export default Dashboard;
