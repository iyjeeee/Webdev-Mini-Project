import React, { useState, useEffect, useCallback } from 'react';
import StatCard from '../../../components/statCard.jsx';
import Pagination from '../../../components/Pagination.jsx';
import { getAttendanceLogs, getAttendanceStats } from '../../../api/attendanceApi.js';

const PAGE_SIZE = 5; // records per page

const STATUS_STYLE = {
  'Present':  'bg-green-500 text-white',
  'Absent':   'bg-red-500 text-white',
  'On Leave': 'bg-yellow-400 text-white',
  'Rest Day': 'bg-gray-400 text-white',
  'Holiday':  'bg-blue-500 text-white',
};

const AttendanceSummary = () => {
  const [logs,        setLogs]       = useState([]);
  const [stats,       setStats]      = useState({});
  const [totalItems,  setTotalItems] = useState(0);
  const [totalPages,  setTotalPages] = useState(1);
  const [loading,     setLoading]    = useState(true);
  const [currentPage, setPage]       = useState(1);

  // Current month string YYYY-MM
  const monthStr = new Date().toISOString().slice(0, 7);
  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [logsRes, statsRes] = await Promise.all([
        getAttendanceLogs({ page: currentPage, pageSize: PAGE_SIZE, month: monthStr }),
        getAttendanceStats({ month: monthStr }),
      ]);
      setLogs(logsRes.data || []);
      setTotalItems(logsRes.pagination?.total     || 0);
      setTotalPages(logsRes.pagination?.totalPages || 1);
      setStats(statsRes.data || {});
    } catch { /* show empty */ }
    finally { setLoading(false); }
  }, [currentPage, monthStr]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200">
        <StatCard value={stats.working_days  ?? '—'} label="WORKING DAYS" description={`${monthLabel} Expected`} />
        <StatCard value={stats.present       ?? 0}   label="PRESENT"      description="Days Attended" />
        <StatCard value={stats.absent        ?? 0}   label="ABSENT"       description="No Absences"   />
        <StatCard value={stats.late          ?? 0}   label="LATE"         description="Late Arrivals"  />
        <StatCard value={`${stats.total_hours ?? 0}h`} label="TOTAL HOURS" description="Rendered This Month" />
      </div>

      {/* Attendance table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 bg-gray-50/30">
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">
            Daily Attendance Summary — {monthLabel}
          </h3>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {['Date','Day','Status','Time In','Time Out','Hours','OT','Late'].map((h) => (
                  <th key={h} className="px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-3 bg-gray-100 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">No records for {monthLabel}.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs font-medium text-gray-800 whitespace-nowrap">{log.date}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{(log.day || '').trim()}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLE[log.status] ?? 'bg-gray-200 text-gray-600'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">{log.time_in  || '—'}</td>
                    <td className="px-5 py-3 text-xs text-gray-600">{log.time_out || '—'}</td>
                    <td className="px-5 py-3 text-xs font-semibold text-gray-800">{log.hours_rendered ? `${log.hours_rendered}h` : '—'}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{log.overtime_hours ? `${log.overtime_hours}h` : '—'}</td>
                    <td className={`px-5 py-3 text-xs font-bold ${log.is_late ? 'text-red-500' : 'text-gray-300'}`}>
                      {log.is_late ? `${log.late_minutes}m` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 pb-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={PAGE_SIZE} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
