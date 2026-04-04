import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDays } from 'lucide-react';
import { getLeaveCredits } from '../../../api/leaveApi.js';

// Color config per leave type name
const TYPE_CONFIG = {
  'Vacation Leave':  { barColor: 'bg-blue-500',   textColor: 'text-blue-600',   borderColor: 'border-blue-200'   },
  'Sick Leave':      { barColor: 'bg-purple-500',  textColor: 'text-purple-600', borderColor: 'border-purple-200' },
  'Emergency Leave': { barColor: 'bg-orange-400',  textColor: 'text-orange-500', borderColor: 'border-orange-200' },
};

// ── Leave Summary Card ────────────────────────────────────────
const LeaveCard = ({ type, allocated, used, barColor, textColor, borderColor }) => {
  const remaining = Math.max(0, allocated - used);
  const pct       = allocated > 0 ? Math.round((remaining / allocated) * 100) : 0;
  return (
    <div className={`border ${borderColor} rounded-xl p-5 flex flex-col gap-3`}>
      <p className={`text-sm font-bold ${textColor}`}>{type}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">{remaining}</span>
        <span className="text-xs text-gray-400 font-medium">/{allocated} days</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 font-medium">
        <span>{used} day{used !== 1 ? 's' : ''} used</span>
        <span>{pct}% remaining</span>
      </div>
    </div>
  );
};

// ── Main Export ───────────────────────────────────────────────
const LeaveCreditsTab = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getLeaveCredits();
      setCredits(res.data || []);
    } catch { /* show empty */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  // Compute totals from real data
  const totals = credits.reduce(
    (acc, r) => ({
      allocated: acc.allocated + (r.total_days || 0),
      used:      acc.used      + (r.used_days  || 0),
      available: acc.available + Math.max(0, (r.total_days || 0) - (r.used_days || 0)),
    }),
    { allocated: 0, used: 0, available: 0 }
  );

  return (
    <div className="p-6 space-y-6">
      {/* Overview Header */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
          <CalendarDays size={15} className="text-gray-400" />
          <h3 className="font-bold text-sm text-gray-700">{new Date().getFullYear()} Leave Credits Overview</h3>
        </div>

        {loading ? (
          <div className="p-5 grid grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-8 bg-gray-100 rounded w-1/3" />
                <div className="h-1.5 bg-gray-100 rounded-full w-full" />
              </div>
            ))}
          </div>
        ) : credits.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-400">No leave credits allocated yet.</div>
        ) : (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {credits.map((c) => {
              const cfg = TYPE_CONFIG[c.leave_type] || { barColor: 'bg-gray-400', textColor: 'text-gray-600', borderColor: 'border-gray-200' };
              return (
                <LeaveCard
                  key={c.leave_type}
                  type={c.leave_type}
                  allocated={c.total_days || 0}
                  used={c.used_days || 0}
                  {...cfg}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Breakdown Table */}
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
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-3 bg-gray-100 rounded w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : credits.map((row) => {
                const available = Math.max(0, (row.total_days || 0) - (row.used_days || 0));
                const pct       = row.total_days > 0 ? Math.round((available / row.total_days) * 100) : 0;
                const cfg       = TYPE_CONFIG[row.leave_type] || { textColor: 'text-gray-600', barColor: 'bg-gray-400' };
                return (
                  <tr key={row.leave_type} className="hover:bg-gray-50/50 transition-colors">
                    <td className={`px-5 py-3 text-xs font-semibold ${cfg.textColor}`}>{row.leave_type}</td>
                    <td className="px-5 py-3 text-xs text-gray-600">{row.total_days}</td>
                    <td className="px-5 py-3 text-xs text-gray-600">{row.used_days}</td>
                    <td className={`px-5 py-3 text-xs font-bold ${cfg.textColor}`}>{available}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-8">{pct}%</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-16">
                          <div className={`h-full rounded-full ${cfg.barColor}`} style={{ width: `${pct}%` }} />
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
            {!loading && credits.length > 0 && (
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
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveCreditsTab;
