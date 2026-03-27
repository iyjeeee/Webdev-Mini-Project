import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_CREDITS = {
  vacation:  { used: 4, total: 15 },
  sick:      { used: 2, total: 15 },
  emergency: { used: 1, total: 3  },
};

const INITIAL_HISTORY = [
  {
    id: 'LV-2026-006',
    leaveType: 'Vacation Leave',
    from: 'Mar 10, 2026',
    to: 'Mar 11, 2026',
    days: 2,
    reason: 'family vacation trip',
    filedOn: 'Mar 7, 2026',
    status: 'Pending',
  },
  {
    id: 'LV-2026-005',
    leaveType: 'Sick Leave',
    from: 'Feb 24, 2026',
    to: 'Feb 25, 2026',
    days: 2,
    reason: 'fever and flu symptoms',
    filedOn: 'Feb 24, 2026',
    status: 'Approved',
  },
  {
    id: 'LV-2026-004',
    leaveType: 'Vacation Leave',
    from: 'Feb 13, 2026',
    to: 'Feb 14, 2026',
    days: 3,
    reason: 'personal rest day',
    filedOn: 'Feb 10, 2026',
    status: 'Rejected',
  },
  {
    id: 'LV-2026-003',
    leaveType: 'Emergency Leave',
    from: 'Jan 20, 2026',
    to: 'Jan 20, 2026',
    days: 1,
    reason: 'family emergency',
    filedOn: 'Jan 20, 2026',
    status: 'Approved',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TYPE_STYLE = {
  'Vacation Leave':  'bg-blue-100 text-blue-700',
  'Sick Leave':      'bg-orange-100 text-orange-700',
  'Emergency Leave': 'bg-red-100 text-red-700',
};

const STATUS_STYLE = {
  Approved:  'bg-green-500 text-white',
  Rejected:  'bg-red-500 text-white',
  Pending:   'bg-yellow-400 text-black',
  Cancelled: 'bg-gray-400 text-white',
};

const toKey = (type) =>
  ({ 'Vacation Leave': 'vacation', 'Sick Leave': 'sick', 'Emergency Leave': 'emergency' }[type] ?? null);

const calcDays = (a, b) => {
  if (!a || !b) return 0;
  const ms = new Date(b) - new Date(a);
  return ms < 0 ? 0 : Math.round(ms / 86400000) + 1;
};

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const nextId = (list) => {
  const max = list.reduce((m, r) => Math.max(m, parseInt(r.id.split('-')[2], 10)), 0);
  return `LV-2026-${String(max + 1).padStart(3, '0')}`;
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({ value, label, description }) => (
  <div className="flex flex-col p-6">
    <h3 className="text-4xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm font-bold text-gray-800 mb-0.5">{label}</p>
    <p className="text-[11px] text-gray-400 leading-tight">{description}</p>
  </div>
);

// ─── Progress-bar row ────────────────────────────────────────────────────────
const LeaveBar = ({ label, used, total }) => {
  const available = total - used;
  const pct = Math.min(100, (used / total) * 100);
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
        <div
          className="h-full rounded-full bg-gray-900 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  const cls = type === 'success'
    ? 'bg-green-50 border-green-400 text-green-800'
    : 'bg-red-50 border-red-400 text-red-800';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${cls}`}>
      <Icon size={18} />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-60 cursor-pointer"><X size={14} /></button>
    </div>
  );
};

// ─── Main Page Component ──────────────────────────────────────────────────────
const Leave = () => {
  const [credits, setCredits]           = useState(INITIAL_CREDITS);
  const [history, setHistory]           = useState(INITIAL_HISTORY);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [yearFilter, setYearFilter]     = useState('2026');
  const [toast, setToast]               = useState(null);
  const [form, setForm]                 = useState({ leaveType: '', dateFrom: '', dateTo: '', reason: '', file: null });
  const [errors, setErrors]             = useState({});
  const [submitting, setSubmitting]     = useState(false);

  const avail = {
    vacation:  credits.vacation.total  - credits.vacation.used,
    sick:      credits.sick.total      - credits.sick.used,
    emergency: credits.emergency.total - credits.emergency.used,
  };
  const numDays      = calcDays(form.dateFrom, form.dateTo);
  const usedThisYear = credits.vacation.used + credits.sick.used + credits.emergency.used;
  const pendingCount = history.filter((r) => r.status === 'Pending').length;

  const filtered = history.filter((r) => {
    const okStatus = statusFilter === 'All Status' || r.status === statusFilter;
    const okYear   = r.filedOn.includes(yearFilter);
    return okStatus && okYear;
  });

  const onChange = ({ target: { name, value } }) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
  };
  const onFile = (e) => setForm((f) => ({ ...f, file: e.target.files[0] || null }));

  const validate = () => {
    const e = {};
    if (!form.leaveType)  e.leaveType = 'Please select a leave type.';
    if (!form.dateFrom)   e.dateFrom  = 'Required.';
    if (!form.dateTo)     e.dateTo    = 'Required.';
    if (form.dateFrom && form.dateTo && new Date(form.dateTo) < new Date(form.dateFrom))
      e.dateTo = 'End date must be after start date.';
    if (!form.reason.trim()) e.reason = 'Please provide a reason.';
    const k = toKey(form.leaveType);
    if (k && numDays > avail[k])
      e.dateTo = `Only ${avail[k]} day(s) available for ${form.leaveType}.`;
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => {
      const entry = {
        id: nextId(history),
        leaveType: form.leaveType,
        from: fmtDate(form.dateFrom),
        to: fmtDate(form.dateTo),
        days: numDays,
        reason: form.reason,
        filedOn: fmtDate(new Date().toISOString().split('T')[0]),
        status: 'Pending',
      };
      setHistory((h) => [entry, ...h]);
      const k = toKey(form.leaveType);
      if (k) setCredits((c) => ({ ...c, [k]: { ...c[k], used: c[k].used + numDays } }));
      setForm({ leaveType: '', dateFrom: '', dateTo: '', reason: '', file: null });
      setErrors({});
      setSubmitting(false);
      flash('Leave request submitted successfully!', 'success');
    }, 500);
  };

  const handleCancel = (id) => {
    setHistory((h) =>
      h.map((r) => {
        if (r.id !== id || r.status !== 'Pending') return r;
        const k = toKey(r.leaveType);
        if (k) setCredits((c) => ({ ...c, [k]: { ...c[k], used: Math.max(0, c[k].used - r.days) } }));
        return { ...r, status: 'Cancelled' };
      })
    );
    flash('Leave request has been cancelled.', 'error');
  };

  const flash = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-4">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page header - Added border */}
      <div className="bg-white rounded-xl px-6 py-4 flex items-start justify-between border border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Leave</h2>
          <p className="text-xs text-gray-400 mt-0.5">Your leave credits, fillings, and approval status</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white outline-none focus:border-yellow-400 cursor-pointer"
          >
            {['All Status','Pending','Approved','Rejected','Cancelled'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white outline-none focus:border-yellow-400 cursor-pointer"
          >
            {['2026','2025','2024'].map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Stat cards - Added outer border */}
      <div className="bg-white rounded-xl overflow-hidden grid grid-cols-5 divide-x divide-gray-200 border border-gray-200">
        <StatCard value={avail.vacation} label="Vacation Leave" description={`Available / ${credits.vacation.total} Total`} />
        <StatCard value={avail.sick} label="Sick Leave" description={`Available / ${credits.sick.total} Total`} />
        <StatCard value={avail.emergency} label="Emergency Leave" description={`Available / ${credits.emergency.total} Total`} />
        <StatCard value={usedThisYear} label="Used This Year" description="Days Consumed" />
        <StatCard value={pendingCount} label="Pending" description="Awaiting Approval" />
      </div>

      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0 space-y-4">
          
          {/* 2026 Leave Credits - Added border */}
          <div className="bg-white rounded-xl px-5 pt-4 pb-1 border border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              2026 Leave Credits
            </p>
            <LeaveBar label="Vacation Leave" used={credits.vacation.used} total={credits.vacation.total} />
            <LeaveBar label="Sick Leave" used={credits.sick.used} total={credits.sick.total} />
            <LeaveBar label="Emergency Leave" used={credits.emergency.used} total={credits.emergency.total} />
          </div>

          {/* Leave History - Added border */}
          <div className="bg-white rounded-xl px-5 pt-4 pb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Leave History</p>
              <p className="text-[11px] text-gray-400">{filtered.length} filings total</p>
            </div>

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
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} className="text-center text-gray-400 py-10 text-sm">No records found.</td></tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2.5 pr-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">{row.id}</td>
                        <td className="py-2.5 pr-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${TYPE_STYLE[row.leaveType] ?? 'bg-gray-100 text-gray-600'}`}>{row.leaveType}</span>
                        </td>
                        <td className="py-2.5 pr-3 text-[11px] text-gray-600 whitespace-nowrap">{row.from}</td>
                        <td className="py-2.5 pr-3 text-[11px] text-gray-600 whitespace-nowrap">{row.to}</td>
                        <td className="py-2.5 pr-3 text-[11px] text-gray-700 font-semibold text-center">{row.days}</td>
                        <td className="py-2.5 pr-3 text-[11px] text-gray-600 max-w-[130px] truncate" title={row.reason}>{row.reason}</td>
                        <td className="py-2.5 pr-3 text-[11px] text-gray-500 whitespace-nowrap">{row.filedOn}</td>
                        <td className="py-2.5 pr-3 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLE[row.status] ?? 'bg-gray-200 text-gray-600'}`}>{row.status}</span>
                        </td>
                        <td className="py-2.5 whitespace-nowrap">
                          {row.status === 'Pending' ? (
                            <button onClick={() => handleCancel(row.id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold rounded transition-colors cursor-pointer">Cancel</button>
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
          </div>
        </div>

        {/* RIGHT: File a Leave Request - Added border */}
        <div className="shrink-0 bg-white rounded-xl p-5 border border-gray-200" style={{ width: '268px' }}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4">File a Leave Request</p>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Leave Type</label>
              <select name="leaveType" value={form.leaveType} onChange={onChange} className={`w-full text-sm border rounded-lg px-3 py-2 bg-white outline-none cursor-pointer transition-colors ${errors.leaveType ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400'}`}>
                <option value="">Select leave type</option>
                <option value="Vacation Leave">Vacation Leave ({avail.vacation} days left)</option>
                <option value="Sick Leave">Sick Leave ({avail.sick} days left)</option>
                <option value="Emergency Leave">Emergency Leave ({avail.emergency} days left)</option>
              </select>
              {errors.leaveType && <p className="text-[10px] text-red-500 mt-0.5">{errors.leaveType}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Date From</label>
              <input type="date" name="dateFrom" value={form.dateFrom} onChange={onChange} className={`w-full text-sm border rounded-lg px-3 py-2 outline-none cursor-pointer transition-colors ${errors.dateFrom ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400'}`} />
              {errors.dateFrom && <p className="text-[10px] text-red-500 mt-0.5">{errors.dateFrom}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Date To</label>
              <input type="date" name="dateTo" value={form.dateTo} min={form.dateFrom} onChange={onChange} className={`w-full text-sm border rounded-lg px-3 py-2 outline-none cursor-pointer transition-colors ${errors.dateTo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400'}`} />
              {errors.dateTo && <p className="text-[10px] text-red-500 mt-0.5">{errors.dateTo}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Number of Days</label>
              <input type="text" readOnly value={numDays > 0 ? numDays : ''} placeholder="0" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reason</label>
              <textarea name="reason" value={form.reason} onChange={onChange} rows={3} placeholder="Briefly describe the reason for your leave...." className={`w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none transition-colors ${errors.reason ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400'}`} />
              {errors.reason && <p className="text-[10px] text-red-500 mt-0.5">{errors.reason}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Supporting Document (Optional)</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer shrink-0">
                  <span className="text-xs px-3 py-1.5 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700">Choose File</span>
                  <input type="file" className="hidden" onChange={onFile} />
                </label>
                <span className="text-[11px] text-gray-400 truncate">{form.file ? form.file.name : 'No file chosen'}</span>
              </div>
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="w-full py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 active:scale-[.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit Leave Request'}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">Leave requests are subject to approval by your immediate supervisor. Ensure you have sufficient credits before filing.</p>
        </div>
      </div>
    </div>
  );
};

export default Leave;