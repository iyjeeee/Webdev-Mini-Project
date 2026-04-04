import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays, CheckCircle2, Circle } from 'lucide-react';
import { getProfile } from '../../../api/employeeApi.js';
import { useAuth } from '../../../context/AuthContext.jsx';

// ── Field display helper ─────────────────────────────────────
const Field = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-900">{value || '—'}</p>
  </div>
);

// ── Timeline step helper ──────────────────────────────────────
const TimelineStep = ({ done, active, title, children }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
        done   ? 'bg-green-500 text-white' :
        active ? 'bg-yellow-400 text-black' :
                 'bg-gray-100 border-2 border-gray-300 text-gray-300'
      }`}>
        {done || active ? <CheckCircle2 size={16} /> : <Circle size={14} />}
      </div>
      <div className="w-px flex-1 bg-gray-200 mt-1" />
    </div>
    <div className="pb-7">
      <p className="text-sm font-bold text-gray-800 mb-1">{title}</p>
      {children}
    </div>
  </div>
);

// ── Helper: compute tenure string ────────────────────────────
const computeTenure = (dateStr) => {
  if (!dateStr) return null;
  const hired = new Date(dateStr);
  const now   = new Date();
  const days  = Math.floor((now - hired) / 86400000);
  const months = Math.floor(days / 30);
  const weeks  = Math.floor((days % 30) / 7);
  if (months === 0) return `${days} days of service`;
  return `${months} month${months !== 1 ? 's' : ''} ${weeks} week${weeks !== 1 ? 's' : ''} of service`;
};

// ── Helper: days until / since date ──────────────────────────
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now    = new Date();
  const diff   = Math.ceil((target - now) / 86400000);
  return diff;
};

const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const EmploymentInfoTab = () => {
  const { user }             = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch { /* show fallback */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // Derive timeline data
  const dateHired       = profile?.date_hired       || null;
  const dateRegularized = profile?.date_regularized || null;
  const tenure          = computeTenure(dateHired);

  // Probation is 6 months from hire by default
  const probEndDate = dateHired
    ? new Date(new Date(dateHired).setMonth(new Date(dateHired).getMonth() + 6))
    : null;
  const daysUntilProbEnd = daysUntil(probEndDate?.toISOString().split('T')[0]);
  const probComplete     = probEndDate ? new Date() >= probEndDate : false;
  const isRegular        = !!dateRegularized;

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-100 rounded w-1/3" />
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
        {/* Header */}
        <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-gray-400" />
            <h3 className="font-bold text-sm text-gray-700">Employment Status & History</h3>
          </div>
          <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Active Employee
          </span>
        </div>

        {/* Fields Grid — real data */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-y-7">
          <Field label="Employee No."     value={profile?.employee_no} />
          <Field label="Job Position"     value={profile?.job_position || user?.jobPosition} />
          <Field label="Department"       value={profile?.department   || user?.department}  />
          <Field label="Work Arrangement" value={profile?.work_arrangement} />
          <Field label="Civil Status"     value={profile?.civil_status} />
          <Field label="Assigned Email"   value={profile?.company_email || user?.email} />
        </div>

        {/* Timeline Section */}
        <div className="border-t border-gray-100 p-6 pt-7 bg-gray-50/30">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Employment Timeline</p>

          <TimelineStep done title="Date Hired">
            <p className="text-sm text-gray-600">{fmtDate(dateHired)}</p>
            {tenure && <p className="text-xs text-gray-400 mt-0.5">Currently active · {tenure}</p>}
          </TimelineStep>

          <TimelineStep done={probComplete} active={!probComplete && !!dateHired} title="Probationary Period">
            {dateHired ? (
              <>
                <p className="text-xs text-gray-600">
                  Start: {fmtDate(dateHired)} | End: {fmtDate(probEndDate?.toISOString())}
                </p>
                {probComplete ? (
                  <p className="text-xs text-green-600 font-bold mt-1">Probationary period completed</p>
                ) : (
                  <p className="text-xs font-bold text-yellow-500 mt-1">
                    Currently on probation · {daysUntilProbEnd > 0 ? `ends in ${daysUntilProbEnd} days` : 'ending soon'}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-400">—</p>
            )}
          </TimelineStep>

          <TimelineStep done={isRegular} active={false} title="Regular Employment">
            {isRegular ? (
              <>
                <p className="text-xs text-gray-600">Regularized: {fmtDate(dateRegularized)}</p>
                <p className="text-xs text-green-600 font-bold mt-1">Regular employee</p>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-600">
                  Expected Start: {fmtDate(probEndDate?.toISOString())}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Pending probationary evaluation</p>
              </>
            )}
          </TimelineStep>
        </div>
      </div>
    </div>
  );
};

export default EmploymentInfoTab;
