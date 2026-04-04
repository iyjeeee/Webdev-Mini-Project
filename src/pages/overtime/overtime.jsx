import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import StatCard from '../../components/statCard.jsx';
import Pagination from '../../components/Pagination.jsx';
import {
  getOvertimeRequests, getOvertimeStats,
  createOvertimeRequest, cancelOvertimeRequest,
} from '../../api/overtimeApi.js';

const PAGE_SIZE = 10;

const STATUS_STYLE = {
  Approved:  'bg-green-500 text-white',
  Rejected:  'bg-red-500 text-white',
  Pending:   'bg-yellow-400 text-black',
  Cancelled: 'bg-gray-400 text-white',
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

// ── File OT Modal (with date range) ──────────────────────────
const OvertimeModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const EMPTY = { dateFrom: '', dateTo: '', otStart: '', otEnd: '', reason: '' };
  const [form,       setForm]       = useState(EMPTY);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState(null);

  useEffect(() => {
    if (isOpen) { setForm(EMPTY); setErrors({}); setApiError(null); }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onChange = ({ target: { name, value } }) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
  };

  // Compute preview hours
  const computeHours = () => {
    if (!form.otStart || !form.otEnd) return 0;
    const [sh, sm] = form.otStart.split(':').map(Number);
    const [eh, em] = form.otEnd.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff <= 0) return 0;
    const hoursPerDay = diff / 60;
    if (!form.dateFrom || !form.dateTo) return +hoursPerDay.toFixed(2);
    const days = Math.round((new Date(form.dateTo) - new Date(form.dateFrom)) / 86400000) + 1;
    return +(hoursPerDay * Math.max(1, days)).toFixed(2);
  };

  const validate = () => {
    const e = {};
    if (!form.dateFrom)  e.dateFrom = 'Start date is required.';
    if (!form.dateTo)    e.dateTo   = 'End date is required.';
    if (form.dateFrom && form.dateTo && form.dateTo < form.dateFrom)
      e.dateTo = 'End date must be on or after start date.';
    if (!form.otStart)   e.otStart  = 'Start time is required.';
    if (!form.otEnd)     e.otEnd    = 'End time is required.';
    if (form.otStart && form.otEnd && form.otEnd <= form.otStart)
      e.otEnd = 'End time must be after start time.';
    if (!form.reason.trim()) e.reason = 'Reason is required.';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true); setApiError(null);
    try {
      await createOvertimeRequest({
        dateFrom: form.dateFrom,
        dateTo:   form.dateTo,
        otStart:  form.otStart,
        otEnd:    form.otEnd,
        reason:   form.reason,
      });
      onSubmitSuccess?.();
    } catch (err) {
      setApiError(err.message || 'Failed to submit. Please try again.');
    } finally { setSubmitting(false); }
  };

  const previewHours = computeHours();
  const fieldCls = (key) =>
    `w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-yellow-400 cursor-pointer ${errors[key] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <div className="h-1.5 w-full bg-[#FBC02D]" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">File Overtime Request</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={18} /></button>
        </div>

        {apiError && (
          <div className="mx-6 mt-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Date range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Start Date *</label>
              <input type="date" name="dateFrom" value={form.dateFrom} onChange={onChange} className={fieldCls('dateFrom')} />
              {errors.dateFrom && <p className="text-[10px] text-red-500 mt-0.5">{errors.dateFrom}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">End Date *</label>
              <input type="date" name="dateTo" value={form.dateTo} min={form.dateFrom} onChange={onChange} className={fieldCls('dateTo')} />
              {errors.dateTo && <p className="text-[10px] text-red-500 mt-0.5">{errors.dateTo}</p>}
            </div>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Start Time *</label>
              <input type="time" name="otStart" value={form.otStart} onChange={onChange} className={fieldCls('otStart')} />
              {errors.otStart && <p className="text-[10px] text-red-500 mt-0.5">{errors.otStart}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">End Time *</label>
              <input type="time" name="otEnd" value={form.otEnd} min={form.otStart} onChange={onChange} className={fieldCls('otEnd')} />
              {errors.otEnd && <p className="text-[10px] text-red-500 mt-0.5">{errors.otEnd}</p>}
            </div>
          </div>

          {/* Total hours preview */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Total Hours (computed)</label>
            <input type="text" readOnly value={previewHours > 0 ? `${previewHours} hrs` : ''}
              placeholder="Auto-computed"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 outline-none" />
          </div>

          {/* Reason */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reason *</label>
            <textarea name="reason" value={form.reason} onChange={onChange} rows={3}
              placeholder="Briefly describe the reason for overtime..."
              className={`w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none focus:border-yellow-400 ${errors.reason ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
            {errors.reason && <p className="text-[10px] text-red-500 mt-0.5">{errors.reason}</p>}
          </div>
        </div>

        <div className="px-6 pb-5 pt-2 border-t border-gray-100">
          <div className="flex rounded-lg overflow-hidden shadow-sm">
            <div className="w-2 bg-[#FBC02D] shrink-0" />
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-2.5 bg-[#111111] text-white font-bold text-sm hover:bg-[#222222] transition-all cursor-pointer disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit OT Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Overtime Page ────────────────────────────────────────
const Overtime = () => {
  const [records,      setRecords]      = useState([]);
  const [stats,        setStats]        = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [totalItems,   setTotalItems]   = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error,        setError]        = useState(null);
  const [toast,        setToast]        = useState(null);
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage,  setPage]         = useState(1);

  const fetchRecords = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await getOvertimeRequests({
        page: currentPage, pageSize: PAGE_SIZE,
        status: statusFilter === 'All Status' ? '' : statusFilter,
      });
      setRecords(res.data || []);
      setTotalItems(res.pagination?.total     || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load overtime records');
    } finally { setLoading(false); }
  }, [currentPage, statusFilter]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try { const res = await getOvertimeStats(); setStats(res.data); }
    catch { /* non-critical */ }
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);
  useEffect(() => { fetchStats();   }, [fetchStats]);

  const flash = (msg, type) => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const handleOTAdded = () => {
    setIsModalOpen(false); setPage(1);
    fetchRecords(); fetchStats();
    flash('Overtime request submitted!', 'success');
  };

  const handleCancel = async (id) => {
    try {
      await cancelOvertimeRequest(id);
      fetchRecords(); fetchStats();
      flash('Overtime request cancelled.', 'error');
    } catch (err) { flash(err.message || 'Failed to cancel', 'error'); }
  };

  return (
    <div className="space-y-4 pb-10">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-white rounded-xl px-6 py-4 flex items-center justify-between border border-gray-200 shadow-sm flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Overtime</h2>
          <p className="text-xs text-gray-400 mt-0.5">Track and manage your overtime requests</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white outline-none focus:border-yellow-400 cursor-pointer">
            {['All Status', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <button onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
            <Plus size={14} /> File Overtime
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="bg-white rounded-xl overflow-hidden grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-200 border border-gray-200 shadow-sm">
        <StatCard value={statsLoading ? '—' : stats.total}    label="Total Filed" description="All Time" />
        <StatCard value={statsLoading ? '—' : stats.approved} label="Approved"    description="All Time" />
        <StatCard value={statsLoading ? '—' : stats.pending}  label="Pending"     description="Awaiting Approval" />
        <StatCard value={statsLoading ? '—' : stats.rejected} label="Rejected"    description="All Time" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl px-5 pt-4 pb-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overtime History</p>
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
                {['REF NO.','START DATE','END DATE','TIME','TOTAL HRS','REASON','FILED ON','STATUS','ACTION'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 pb-2 pr-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} className="py-2.5 pr-3"><div className="h-3 bg-gray-100 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-gray-400 py-10 text-sm">No records found.</td></tr>
              ) : (
                records.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">{row.reference_no}</td>
                    <td className="py-2.5 pr-3 text-[11px] text-gray-700 whitespace-nowrap">{row.ot_date || row.date}</td>
                    <td className="py-2.5 pr-3 text-[11px] text-gray-500 whitespace-nowrap">{row.dateTo || '—'}</td>
                    <td className="py-2.5 pr-3 text-[11px] text-gray-600 whitespace-nowrap">{row.ot_start} – {row.ot_end}</td>
                    <td className="py-2.5 pr-3 text-[11px] text-gray-700 font-semibold">{row.total_hours}h</td>
                    <td className="py-2.5 pr-3 text-[11px] text-gray-600 max-w-[120px] truncate" title={row.reason}>{row.reason || '—'}</td>
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
                      ) : <span className="text-gray-300 text-[10px]">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={totalItems} pageSize={PAGE_SIZE} />
      </div>

      <OvertimeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmitSuccess={handleOTAdded} />
    </div>
  );
};

export default Overtime;
