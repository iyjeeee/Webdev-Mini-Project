import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../../components/statCard.jsx';
import Pagination from '../../components/Pagination.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAttendanceLogs, getAttendanceStats } from '../../api/attendanceApi.js';

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  'Present': { color: 'bg-green-500',  label: 'P' },
  'L':       { color: 'bg-orange-500', label: 'L' },
  'Absent':  { color: 'bg-red-500',    label: 'A' },
  'On Leave':{ color: 'bg-blue-500',   label: 'OL'},
};

const Attendance = () => {
  const { todayAttendance, attLoading, doTimeIn, doTimeOut, fetchTodayAttendance } = useAuth();

  const [logs,         setLogs]        = useState([]);
  const [stats,        setStats]       = useState({ present: 0, absent: 0, late: 0, on_leave: 0 });
  const [totalItems,   setTotalItems]  = useState(0);
  const [totalPages,   setTotalPages]  = useState(1);
  const [loading,      setLoading]     = useState(true);
  const [statsLoading, setStatsLoading]= useState(true);
  const [currentPage,  setPage]        = useState(1);
  const [timeActionErr,setTimeErr]     = useState(null);

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const monthStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}`;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAttendanceLogs({ page: currentPage, pageSize: PAGE_SIZE, month: monthStr });
      setLogs(res.data || []);
      setTotalItems(res.pagination?.total     || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch { /* show empty */ }
    finally { setLoading(false); }
  }, [currentPage, monthStr]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getAttendanceStats({ month: monthStr });
      setStats(res.data || {});
    } catch { /* non-critical */ }
    finally { setStatsLoading(false); }
  }, [monthStr]);

  useEffect(() => { fetchTodayAttendance(); }, [fetchTodayAttendance]);
  useEffect(() => { fetchLogs();  }, [fetchLogs]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleMonthChange = (offset) => {
    setViewDate((prev) => {
      let m = prev.month + offset;
      let y = prev.year;
      if (m > 11) { m = 0;  y += 1; }
      if (m < 0)  { m = 11; y -= 1; }
      return { year: y, month: m };
    });
    setPage(1);
  };

  const monthLabel = new Date(viewDate.year, viewDate.month, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const hasTimeIn  = !!todayAttendance?.time_in;
  const hasTimeOut = !!todayAttendance?.time_out;
  const isComplete = hasTimeIn && hasTimeOut;

  const handleTimeIn = async () => {
    setTimeErr(null);
    const r = await doTimeIn();
    if (!r.success) setTimeErr(r.message);
    else { fetchLogs(); fetchStats(); }
  };
  const handleTimeOut = async () => {
    setTimeErr(null);
    const r = await doTimeOut();
    if (!r.success) setTimeErr(r.message);
    else { fetchLogs(); fetchStats(); }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">My Attendance</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">Your attendance records and time logs</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
            <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer">
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 text-sm font-bold text-gray-700">{monthLabel}</span>
            <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Time-in status bar */}
      <div className="bg-black text-white p-8 rounded-xl shadow-lg flex justify-between items-center flex-wrap gap-6 relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isComplete ? 'bg-green-400' : hasTimeIn ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
            <h3 className="text-3xl font-bold">
              {isComplete ? 'Logged Out' : hasTimeIn ? 'Logged In' : 'Not Yet Timed In'}
            </h3>
          </div>

          {timeActionErr && <p className="text-xs text-red-400 font-medium">{timeActionErr}</p>}
          {!timeActionErr && (
            <p className="text-xs text-gray-400 font-medium">
              {isComplete
                ? 'Your attendance is complete for today.'
                : hasTimeIn
                ? 'Click Time Out when you are done for the day.'
                : 'Click Time In to record your attendance for today.'}
            </p>
          )}

          <div className="flex gap-12 pt-2 flex-wrap">
            <StatusDetail label="TIME IN"        value={hasTimeIn  ? (todayAttendance.time_in  || '—') : '—'} />
            <StatusDetail label="TIME OUT"       value={hasTimeOut ? (todayAttendance.time_out || '—') : '—'} />
            <StatusDetail label="Hours Rendered" value={
              todayAttendance?.hours_rendered ? `${todayAttendance.hours_rendered}h` : '—'
            } />
          </div>
        </div>

        {!isComplete && (
          <button
            onClick={hasTimeIn ? handleTimeOut : handleTimeIn}
            disabled={attLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold text-m transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {attLoading ? '...' : hasTimeIn ? 'Time Out!' : 'Time In!'}
          </button>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200">
        <StatCard value={statsLoading ? '—' : stats.present  ?? 0} label="Days Present"  description={monthLabel} />
        <StatCard value={statsLoading ? '—' : stats.absent   ?? 0} label="Days Absent"   description="Excused: 0" />
        <StatCard value={statsLoading ? '—' : stats.late     ?? 0} label="Late Arrivals" description={monthLabel} />
        <StatCard value={statsLoading ? '—' : stats.on_leave ?? 0} label="On Leave Days" description={monthLabel} />
      </div>

      {/* Attendance log table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-bold text-gray-800">Attendance Log</h3>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold text-gray-500">Legend:</span>
            <LegendItem color="bg-green-500"  letter="P"  label="Present" />
            <LegendItem color="bg-orange-500" letter="L"  label="Late" />
            <LegendItem color="bg-red-500"    letter="A"  label="Absent" />
            <LegendItem color="bg-blue-500"   letter="OL" label="On Leave" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Day</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time In</th>
                <th className="px-6 py-4">Time Out</th>
                <th className="px-6 py-4">Hours Rendered</th>
                <th className="px-6 py-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">
                    No attendance records for {monthLabel}.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const cfg = STATUS_CONFIG[log.status] || { color: 'bg-gray-400', label: log.status?.[0] || '?' };
                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-[13px] text-gray-800 font-medium whitespace-nowrap">{log.date}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500">{(log.day || '').trim()}</td>
                      <td className="px-6 py-4">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${cfg.color}`}>
                          {cfg.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-700">{log.time_in  || '—'}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-700">{log.time_out || '—'}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-700">
                        {log.hours_rendered ? `${log.hours_rendered}h` : '—'}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-gray-400">
                        {log.is_late && log.late_minutes ? (
                          <span className="text-orange-500 font-bold">Late {log.late_minutes}m</span>
                        ) : log.remarks ? (
                          <span className="text-gray-500">{log.remarks}</span>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </div>
  );
};

const StatusDetail = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{label}</p>
    <span className="text-xl font-bold">{value}</span>
  </div>
);

const LegendItem = ({ color, letter, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 rounded-full ${color} flex items-center justify-center text-[8px] text-white font-bold`}>
      {letter}
    </div>
    <span className="text-[11px] text-gray-400 font-medium">{label}</span>
  </div>
);

export default Attendance;
