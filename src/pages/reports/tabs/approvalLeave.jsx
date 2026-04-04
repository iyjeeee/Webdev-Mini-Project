import React, { useState, useEffect, useCallback } from 'react';
import StatCard from '../../../components/statCard.jsx';
import Pagination from '../../../components/Pagination.jsx';
import { getLeaveRequests, getLeaveCredits, getLeaveStats } from '../../../api/leaveApi.js';

const PAGE_SIZE = 5;

const STATUS_STYLE = {
  Approved:  'bg-green-500 text-white',
  Rejected:  'bg-red-500 text-white',
  Pending:   'bg-yellow-400 text-white',
  Cancelled: 'bg-gray-400 text-white',
};

const TYPE_STYLE = {
  'Vacation Leave':  'bg-blue-100 text-blue-700',
  'Sick Leave':      'bg-orange-100 text-orange-700',
  'Emergency Leave': 'bg-red-100 text-red-700',
};

const ApprovalLeave = () => {
  const [records,     setRecords]    = useState([]);
  const [credits,     setCredits]    = useState([]);
  const [stats,       setStats]      = useState({});
  const [totalItems,  setTotalItems] = useState(0);
  const [totalPages,  setTotalPages] = useState(1);
  const [loading,     setLoading]    = useState(true);
  const [currentPage, setPage]       = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [leaveRes, creditsRes, statsRes] = await Promise.all([
        getLeaveRequests({ page: currentPage, pageSize: PAGE_SIZE }),
        getLeaveCredits(),
        getLeaveStats(),
      ]);
      setRecords(leaveRes.data || []);
      setTotalItems(leaveRes.pagination?.total     || 0);
      setTotalPages(leaveRes.pagination?.totalPages || 1);
      setCredits(creditsRes.data || []);
      setStats(statsRes.data || {});
    } catch { /* show empty */ }
    finally { setLoading(false); }
  }, [currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const getAvail = (name) => {
    const c = credits.find((l) => l.leave_type === name);
    return c ? Math.max(0, c.total_days - c.used_days) : 0;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200">
        <StatCard value={getAvail('Vacation Leave')}  label="Vacation Leave"  description="Available Days" />
        <StatCard value={getAvail('Sick Leave')}      label="Sick Leave"      description="Available Days" />
        <StatCard value={getAvail('Emergency Leave')} label="Emergency Leave" description="Available Days" />
        <StatCard value={stats.pending ?? 0}          label="Pending"         description="Awaiting Approval" />
      </div>

      {/* Leave history table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/30">
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Leave Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                {['Ref No.','Type','From','To','Days','Reason','Filed On','Status'].map((h) => (
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
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-gray-400">No leave records found.</td>
                </tr>
              ) : (
                records.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-[11px] font-mono text-gray-500 whitespace-nowrap">{row.reference_no}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${TYPE_STYLE[row.leave_type] ?? 'bg-gray-100 text-gray-600'}`}>
                        {row.leave_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[11px] text-gray-600 whitespace-nowrap">{row.date_from}</td>
                    <td className="px-5 py-3 text-[11px] text-gray-600 whitespace-nowrap">{row.date_to}</td>
                    <td className="px-5 py-3 text-[11px] font-semibold text-center text-gray-700">{row.number_of_days}</td>
                    <td className="px-5 py-3 text-[11px] text-gray-600 max-w-[130px] truncate" title={row.reason}>{row.reason}</td>
                    <td className="px-5 py-3 text-[11px] text-gray-500 whitespace-nowrap">{row.filed_on}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLE[row.status] ?? 'bg-gray-200 text-gray-600'}`}>
                        {row.status}
                      </span>
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

export default ApprovalLeave;
