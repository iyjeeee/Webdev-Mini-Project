import React from 'react';
import { CalendarDays } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const LEAVE_DATA = [
  {
    type:      'Vacation Leave',
    allocated: 15,
    used:      4,
    color:     'blue',
    barColor:  'bg-blue-500',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-300',
  },
  {
    type:      'Sick Leave',
    allocated: 15,
    used:      2,
    color:     'purple',
    barColor:  'bg-purple-500',
    textColor: 'text-purple-500',
    borderColor: 'border-purple-300',
  },
  {
    type:      'Emergency Leave',
    allocated: 3,
    used:      1,
    color:     'orange',
    barColor:  'bg-orange-400',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-300',
  },
];

// ── Leave Summary Card ────────────────────────────────────────────────────────
const LeaveCard = ({ type, allocated, used, barColor, textColor, borderColor }) => {
  const remaining   = allocated - used;
  const pct         = Math.round((remaining / allocated) * 100);

  return (
    <div className={`border ${borderColor} rounded-xl p-5 flex flex-col gap-3`}>
      <p className={`text-sm font-bold ${textColor}`}>{type}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">{remaining}</span>
        <span className="text-xs text-gray-400 font-medium">/{allocated} days</span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
        <span>{used} day{used !== 1 ? 's' : ''} used</span>
        <span>{pct}% remaining</span>
      </div>
    </div>
  );
};

// ── Detailed Breakdown Table ──────────────────────────────────────────────────
const BreakdownTable = () => {
  const totals = LEAVE_DATA.reduce(
    (acc, r) => ({
      allocated: acc.allocated + r.allocated,
      used:      acc.used      + r.used,
      available: acc.available + (r.allocated - r.used),
    }),
    { allocated: 0, used: 0, available: 0 }
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Detailed Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              <th className="px-5 py-3">Leave Type</th>
              <th className="px-5 py-3">Total Allocated</th>
              <th className="px-5 py-3">Used Credits</th>
              <th className="px-5 py-3">Available Credits</th>
              <th className="px-5 py-3">% Remaining</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {LEAVE_DATA.map((row) => {
              const available = row.allocated - row.used;
              const pct       = Math.round((available / row.allocated) * 100);
              return (
                <tr key={row.type} className="hover:bg-gray-50/50 transition-colors">
                  <td className={`px-5 py-3 text-xs font-semibold ${row.textColor}`}>{row.type}</td>
                  <td className="px-5 py-3 text-xs text-gray-600">{row.allocated}</td>
                  <td className="px-5 py-3 text-xs text-gray-600">{row.used}</td>
                  <td className={`px-5 py-3 text-xs font-bold ${row.textColor}`}>{available}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-8">{pct}%</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-16">
                        <div
                          className={`h-full rounded-full ${row.barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2.5 py-1 rounded-full">
                      Available
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Totals row */}
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50/60">
              <td className="px-5 py-3 text-xs font-bold text-gray-800">Total</td>
              <td className="px-5 py-3 text-xs font-bold text-gray-800">{totals.allocated}</td>
              <td className="px-5 py-3 text-xs font-bold text-gray-800">{totals.used}</td>
              <td className="px-5 py-3 text-xs font-bold text-gray-800">{totals.available}</td>
              <td className="px-5 py-3" />
              <td className="px-5 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

// ── Main Export ───────────────────────────────────────────────────────────────
const LeaveCreditsTab = () => (
  <div className="p-6 space-y-6">
    {/* Overview Header */}
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
        <CalendarDays size={15} className="text-gray-400" />
        <h3 className="font-bold text-sm text-gray-700">2026 Leave Credits Overview</h3>
      </div>
      <div className="p-5 grid grid-cols-3 gap-4">
        {LEAVE_DATA.map(leave => (
          <LeaveCard key={leave.type} {...leave} />
        ))}
      </div>
    </div>

    {/* Breakdown Table */}
    <BreakdownTable />
  </div>
);

export default LeaveCreditsTab;