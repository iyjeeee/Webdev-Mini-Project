import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import LeaveRequestModal from './leaveRequestModal.jsx';
import Pagination from '../../components/Pagination';
import {
  getLeaveRequests, getLeaveCredits,
  getLeaveStats,    cancelLeaveRequest,
} from '../../api/leaveApi.js';

const PAGE_SIZE = 10; // rows per page

// Style maps — consistent with existing design
const TYPE_STYLE = {
  'Vacation Leave':  'bg-blue-100 text-blue-700',
  'Sick Leave':      'bg-orange-100 text-orange-700',
  'Emergency Leave': 'bg-red-100 text-red-700',
};
const STATUS_STYLE = {
  Approved:  'bg-green-500 text-white',
  Rejected:  'bg-red-500 text-white',
  Pending:   'bg-yellow-400 text-white',
  Cancelled: 'bg-gray-400 text-white',
};

// ── Sub-components (same design as original) ──────────────────
const StatCard = ({ value, label, description }) => (
  <div className="flex flex-col p-6">
    <h3 className="text-4xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm font-bold text-gray-800 mb-0.5">{label}</p>
    <p className="text-[11px] text-gray-400 leading-tight">{description}</p>
  </div>
);

const LeaveBar = ({ label, used, total }) => {
  const available = total - used;
  const pct = Math.min(100, total > 0 ? (used / total) * 100 : 0);
  return (
    <div className="py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-[11px] text-gray-400">{used} used / {total} days allocated</p>
        </div>
        <span className="text-2xl font-bold text-gray-900 tabular-nums w-8 text-right">
          {String(available).padStart(2, '0')}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gray-900 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  const cls  = type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 'bg-red-50 border-red-400 text-red-800';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${cls}`}>
      <Icon size={18} />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-60 cursor-pointer"><X size={14} /></button>
    </div>
  );
};

// Skeleton row for loading state
const SkeletonRow = ({ cols }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-2.5 pr-3"><div className="h-3 bg-gray-100 rounded w-full" /></td>
    ))}
  </tr>
);

const Leave = () => {
  // ── State ────────────────────────────────────────────────
  const [records,       setRecords]       = useState([]);
  const [credits,       setCredits]       = useState([]);       // leave credit allocations
  const [stats,         setStats]         = useState({ total: 0, approved: 0, pending: 0, rejected: 0, usedThisYear: 0 });
  const [totalItems,    setTotalItems]    = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [creditsLoading,setCreditsLoading]= useState(true);
  const [statsLoading,  setStatsLoading]  = useState(true);
  const [error,         setError]         = useState(null);
  const [toast,         setToast]         = useState(null);
  const [isModalOpen,   setIsModalOpen]   = useState(false);
  const [statusFilter,  setStatusFilter]  = useState('All Status');
  const [yearFilter,    setYearFilter]    = useState('All');
  const [currentPage,   setPage]          = useState(1);

  // ── Fetch helpers ─────────────────────────────────────────
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeaveRequests({
        page: currentPage, pageSize: PAGE_SIZE,
        status: statusFilter === 'All Status' ? '' : statusFilter,
        year:   yearFilter   === 'All'        ? '' : yearFilter,
      });
      setRecords(res.data || []);
      setTotalItems(res.pagination?.total     || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load leave records');
    } finally { setLoading(false); }
  }, [currentPage, statusFilter, yearFilter]);

  const fetchCredits = useCallback(async () => {
    setCreditsLoading(true);
    try {
      const res = await getLeaveCredits();
      setCredits(res.data || []);
    } catch { /* non-critical */ }
    finally { setCreditsLoading(false); }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getLeaveStats();
      setStats(res.data);
    } catch { /* non-critical */ }
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);
  useEffect(() => { fetchCredits(); fetchStats(); }, [fetchCredits, fetchStats]);

  // ── Handlers ─────────────────────────────────────────────
  const handleStatusFilter = (v) => { setStatusFilter(v); setPage(1); };
  const handleYearFilter   = (v) => { setYearFilter(v);   setPage(1); };

  const handleLeaveAdded = () => {
    setIsModalOpen(false);
    setPage(1);
    fetchRecords();
    fetchCredits();
    fetchStats();
    flash('Leave request submitted successfully!', 'success');
  };

  const handleCancel = async (id) => {
    try {
      await cancelLeaveRequest(id);
      fetchRecords();
      fetchCredits();
      fetchStats();
      flash('Leave request has been cancelled.', 'error');
    } catch (err) {
      flash(err.message || 'Failed to cancel request', 'error');
    }
  };

  const flash = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper: get available days for a leave type from credits array
  const getAvail = (typeName) => {
    const credit = credits.find((c) => c.leave_type === typeName);
    return credit ? credit.remaining_days : 0;
  };

  // Build avail object for modal
  const avail = {
    vacation:  getAvail('Vacation Leave'),
    sick:      getAvail('Sick Leave'),
    emergency: getAvail('Emergency Leave'),
  };

  return (
    <div className="space-y-4 pb-10">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ── */}
      <div className="bg-white rounded-xl px-6 py-4 flex items-center justify-between border border-gray-200 shadow-sm flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Leave</h2>
          <p className="text-xs text-gray-400 mt-0.5">Your leave credits, filings, and approval status</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Status filter */}
            <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white outline-none focus:border-yellow-400 cursor-pointer">
              {['All Status', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {/* Year filter */}
            <select value={yearFilter} onChange={(e) => handleYearFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white outline-none focus:border-yellow-400 cursor-pointer">
              {['All', '2026', '2025', '2024'].map((y) => (
                <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>
              ))}
            </select>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
            + File Leave
          </button>
        </div>
      </div>

      {/* ── Credit Summary Stat Cards ── */}
      <div className="bg-white rounded-xl overflow-hidden grid grid-cols-2 sm:grid-cols-5 divide-x divide-gray-200 border border-gray-200 shadow-sm">
        <StatCard value={statsLoading ? '—' : getAvail('Vacation Leave')}  label="Vacation Leave"  description={`Available / ${credits.find(c=>c.leave_type==='Vacation Leave')?.total_days||15} Total`} />
        <StatCard value={statsLoading ? '—' : getAvail('Sick Leave')}      label="Sick Leave"      description={`Available / ${credits.find(c=>c.leave_type==='Sick Leave')?.total_days||15} Total`} />
        <StatCard value={statsLoading ? '—' : getAvail('Emergency Leave')} label="Emergency Leave" description={`Available / ${credits.find(c=>c.leave_type==='Emergency Leave')?.total_days||3} Total`} />
        <StatCard value={statsLoading ? '—' : stats.usedThisYear}          label="Used This Year"  description="Days Consumed" />
        <StatCard value={statsLoading ? '—' : stats.pending}               label="Pending"         description="Awaiting Approval" />
      </div>

      <div className="space-y-4">
        {/* ── Credit Bars ── */}
        <div className="bg-white rounded-xl px-5 pt-4 pb-1 border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {new Date().getFullYear()} Leave Credits
          </p>
          {creditsLoading ? (
            <div className="py-6 text-center text-gray-400 text-sm">Loading credits...</div>
          ) : credits.length > 0 ? (
            credits.map((c) => (
              <LeaveBar key={c.leave_type} label={c.leave_type} used={c.used_days} total={c.total_days} />
            ))
          ) : (
            <div className="py-4 text-center text-gray-400 text-sm">No credit allocations found.</div>
          )}
        </div>

        {/* ── Leave History Table ── */}
        <div className="bg-white rounded-xl px-5 pt-4 pb-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Leave History</p>
            <p className="text-[11px] text-gray-400">{loading ? '...' : `${totalItems} filing${totalItems !== 1 ? 's' : ''} total`}</p>
          </div>

          {error && (
            <div className="mb-3 px-4 py-2 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  {['REFERENCE NO.','LEAVE TYPE','FROM','TO','DAYS','REASON','FILED ON','STATUS','ACTION'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-bold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={9} />)
                ) : records.length === 0 ? (
                  <tr><td colSpan={9} className="text-center text-gray-400 py-10 text-sm">No records found.</td></tr>
                ) : (
                  records.map((row) => (
                    <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 pr-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">{row.reference_no}</td>
                      <td className="py-2.5 pr-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${TYPE_STYLE[row.leave_type] ?? 'bg-gray-100 text-gray-600'}`}>
                          {row.leave_type}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-[11px] text-gray-600 whitespace-nowrap">{row.date_from}</td>
                      <td className="py-2.5 pr-3 text-[11px] text-gray-600 whitespace-nowrap">{row.date_to}</td>
                      <td className="py-2.5 pr-3 text-[11px] text-gray-700 font-semibold text-center">{row.number_of_days}</td>
                      <td className="py-2.5 pr-3 text-[11px] text-gray-600 max-w-[130px] truncate" title={row.reason}>{row.reason}</td>
                      <td className="py-2.5 pr-3 text-[11px] text-gray-500 whitespace-nowrap">{row.filed_on}</td>
                      <td className="py-2.5 pr-3 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLE[row.status] ?? 'bg-gray-200 text-gray-600'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 whitespace-nowrap">
                        {row.status === 'Pending' ? (
                          <button onClick={() => handleCancel(row.id)}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold rounded transition-colors cursor-pointer">
                            Cancel
                          </button>
                        ) : (
                          <span className="text-gray-300 text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — always shown */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>

      {/* Leave request modal */}
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        avail={avail}
        onSubmitSuccess={handleLeaveAdded}
      />
    </div>
  );
};

export default Leave;
