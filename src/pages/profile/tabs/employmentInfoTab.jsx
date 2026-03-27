import React from 'react';
import { CalendarDays, ShieldCheck, CheckCircle2, Circle } from 'lucide-react';

// ── Reusable field display ────────────────────────────────────────────────────
const Field = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-900">{value}</p>
  </div>
);

// ── Employment Status Section ─────────────────────────────────────────────────
const EmploymentStatus = () => (
  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    {/* Header */}
    <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CalendarDays size={15} className="text-gray-400" />
        <h3 className="font-bold text-sm text-gray-700">Employment Status</h3>
      </div>
      <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        Active Employee
      </span>
    </div>

    {/* Fields Grid */}
    <div className="p-6 grid grid-cols-3 gap-y-7">
      <Field label="Employee No."       value="HS-008" />
      <Field label="Job Position"       value="Junior Software Developer" />
      <Field label="Department"         value="Information Technology" />
      <Field label="Work Arrangement"   value="On-site" />
      <Field label="Required Time-In"   value="10:00 AM + 15 mins grace period" />
      <Field label="Assigned Email"     value="johndoe.hs@gmail.com" />
    </div>
  </div>
);

// ── Timeline step ─────────────────────────────────────────────────────────────
const TimelineStep = ({ done, active, title, children }) => (
  <div className="flex gap-4">
    {/* Icon + line */}
    <div className="flex flex-col items-center">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
        done   ? 'bg-green-500 text-white' :
        active ? 'bg-yellow-400 text-white' :
                 'bg-gray-100 border-2 border-gray-300 text-gray-300'
      }`}>
        {done || active
          ? <CheckCircle2 size={16} />
          : <Circle size={14} />
        }
      </div>
      <div className="w-px flex-1 bg-gray-200 mt-1" />
    </div>

    {/* Content */}
    <div className="pb-7">
      <p className="text-sm font-bold text-gray-800 mb-1">{title}</p>
      {children}
    </div>
  </div>
);

// ── Employment Dates Section ──────────────────────────────────────────────────
const EmploymentDates = () => (
  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm h-fit">
    <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
      <CalendarDays size={15} className="text-gray-400" />
      <h3 className="font-bold text-sm text-gray-700">Employment Dates</h3>
    </div>
    <div className="p-6 pt-7">
      <TimelineStep done title="Date Hired">
        <p className="text-sm text-gray-600">October 26, 2025</p>
        <p className="text-xs text-gray-400 mt-0.5">Currently active · 4 months 2 weeks of service</p>
      </TimelineStep>

      <TimelineStep active title="Probationary Period">
        <p className="text-xs text-gray-600">Start: Oct 26, 2025 | End: April 25, 2026</p>
        <p className="text-xs font-bold text-yellow-500 mt-1">Currently on probation · end in 44 days</p>
      </TimelineStep>

      <TimelineStep title="Regular Employment">
        <p className="text-xs text-gray-600">Expected Start: April 26, 2026</p>
        <p className="text-xs text-gray-400 mt-0.5">Pending probationary evaluation</p>
      </TimelineStep>
    </div>
  </div>
);

// ── Benefit & Insurance Section ───────────────────────────────────────────────
const BenefitRow = ({ label, value, bold }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-400 font-medium">{label}</span>
    <span className={`text-xs text-right ${bold ? 'font-bold text-gray-800' : 'text-gray-700 font-semibold'}`}>{value}</span>
  </div>
);

const BenefitInsurance = () => (
  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm h-fit">
    <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
      <ShieldCheck size={15} className="text-gray-400" />
      <h3 className="font-bold text-sm text-gray-700">Benefit & Insurance</h3>
    </div>
    <div className="px-5 py-2">
      <BenefitRow label="HMO Provider"             value="Maxicare Healthcare Corp."        bold />
      <BenefitRow label="HMO Number"               value="MXC-2025-008-GKM" />
      <BenefitRow label="HMO Coverage"             value="P 100,000 / year" />
      <BenefitRow label="Life Insurance Provider"  value="Sun Life of the Philippines"      bold />
      <BenefitRow label="Life Insurance Policy #"  value="SL-PH-2025-00841" />
      <BenefitRow label="Coverage Amount"          value="P 500,000" />
    </div>
  </div>
);

// ── Main Export ───────────────────────────────────────────────────────────────
const EmploymentInfoTab = () => (
  <div className="p-6 space-y-6">
    <EmploymentStatus />
    <div className="grid grid-cols-2 gap-5">
      <EmploymentDates />
      <BenefitInsurance />
    </div>
  </div>
);

export default EmploymentInfoTab;