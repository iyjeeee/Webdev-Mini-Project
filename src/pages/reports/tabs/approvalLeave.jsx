import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StatCard from '../../../components/statCard'; 

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

const MOCK_HISTORY = [
  { ref: 'LV-2026-005', type: 'Vacation Leave',  from: 'March 10, 2026', to: 'March 11, 2026', days: 2, reason: 'Family Vacation Trip', filed: 'March 02, 2026', status: 'Pending', decisionBy: '----------', decisionDate: '----------', remarks: '----------' },
  { ref: 'LV-2026-004', type: 'Sick Leave',      from: 'Feb 24, 2026',   to: 'Feb 25, 2026',   days: 2, reason: 'Fever and Flu Symptoms', filed: 'Feb 15, 2026', status: 'Pending', decisionBy: '----------', decisionDate: '----------', remarks: '----------' },
  { ref: 'LV-2026-003', type: 'Vacation Leave',  from: 'Feb 12, 2026',   to: 'Feb 14, 2026',   days: 3, reason: 'Personal Rest After Project Delivery', filed: 'Feb 03, 2026', status: 'Approved', decisionBy: 'Reginald Aquino', decisionDate: 'Feb 26, 2026', remarks: '----------' },
  { ref: 'LV-2026-002', type: 'Emergency Leave', from: 'Jan 20, 2026',   to: 'Jan 20, 2026',   days: 1, reason: 'Family Emergency', filed: 'Jan 14, 2026', status: 'Approved', decisionBy: 'Juan Dela Cruz', decisionDate: 'Feb 25, 2026', remarks: '----------' },
  { ref: 'LV-2026-001', type: 'Vacation Leave',  from: 'Jan 15, 2026',   to: 'Jan 15, 2026',   days: 1, reason: 'Rest Day', filed: 'Jan 10, 2026', status: 'Approved', decisionBy: 'Anna Patricia Lopez', decisionDate: 'Feb 21, 2026', remarks: '----------' },
  { ref: 'LV-2025-012', type: 'Sick Leave',      from: 'Dec 20, 2025',   to: 'Dec 20, 2025',   days: 1, reason: 'Headache and Flu', filed: 'Nov 28, 2025', status: 'Approved', decisionBy: 'Christine Joy Ramos', decisionDate: 'Feb 19, 2026', remarks: '----------' },
];

// Helper component for the Expanded Details
const DetailField = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs font-bold text-gray-900">{value}</p>
  </div>
);

// Helper component for the Middle Leave Balance Cards
const LeaveBalanceCard = ({ title, remaining, allocated, used }) => {
  const pct = Math.min(100, (used / allocated) * 100);
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
        <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{title}</h4>
        <span className="text-2xl font-black text-gray-900">{remaining}</span>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500 font-bold">Allocated</span>
          <span className="font-bold text-gray-900">{allocated} days</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500 font-bold">Used</span>
          <span className="font-bold text-gray-900">{used} days</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500 font-bold">Remaining</span>
          <span className="font-bold text-gray-900">{remaining} days</span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-auto">
        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
};

const ApprovalLeave = () => {
  // State for expanding rows
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200">
        <StatCard value="6"   label="TOTAL FILED"    description="All leave requests" />
        <StatCard value="4"   label="APPROVED"       description="7 days approved" />
        <StatCard value="1"   label="PENDING"        description="Awaiting decision" />
        <StatCard value="1"   label="REJECTED"       description="All Time" />
      </div>

      {/* Leave Balances Row */}
      <div className="grid grid-cols-3 gap-5">
        <LeaveBalanceCard title="Vacation Leave" remaining={11} allocated={15} used={4} />
        <LeaveBalanceCard title="Sick Leave" remaining={13} allocated={15} used={2} />
        <LeaveBalanceCard title="Emergency Leave" remaining={2} allocated={3} used={1} />
      </div>

      {/* Leave Approval Report Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Leave Approval Report — John Doe (HS - 008)</h3>
          <span className="text-[10px] text-gray-400 font-medium">Click a row to view full details</span>
        </div>

        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-[9px] uppercase tracking-wider text-gray-800 font-black">
                <th className="px-5 py-4 whitespace-nowrap">Reference No.</th>
                <th className="px-5 py-4 whitespace-nowrap">Leave Type</th>
                <th className="px-5 py-4 whitespace-nowrap">Dates</th>
                <th className="px-5 py-4 whitespace-nowrap">Days</th>
                <th className="px-5 py-4 whitespace-nowrap w-1/4">Reason</th>
                <th className="px-5 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_HISTORY.map((leave, index) => {
                const isExpanded = expandedRow === index;
                const dateDisplay = leave.from === leave.to ? leave.from : `${leave.from} - ${leave.to}`;

                return (
                  <React.Fragment key={index}>
                    {/* Main Row */}
                    <tr 
                      onClick={() => toggleRow(index)}
                      className={`transition-colors cursor-pointer ${isExpanded ? 'bg-yellow-50/30' : 'hover:bg-gray-50/80'}`}
                    >
                      <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{leave.ref}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${TYPE_STYLE[leave.type] ?? 'bg-gray-100 text-gray-600'}`}>
                          {leave.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[10px] text-gray-900 font-bold whitespace-nowrap">{dateDisplay}</td>
                      <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{leave.days}</td>
                      <td className="px-5 py-4 text-[10px] text-gray-900 font-bold truncate max-w-[200px]" title={leave.reason}>{leave.reason}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold shadow-sm ${STATUS_STYLE[leave.status] ?? 'bg-gray-200 text-gray-600'}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-gray-400">
                        {isExpanded ? <ChevronUp size={16} className="inline-block" /> : <ChevronDown size={16} className="inline-block" />}
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <tr className="bg-gray-50/50 border-b border-gray-200">
                        <td colSpan="7" className="px-5 py-6">
                          <div className="grid grid-cols-4 gap-y-6 gap-x-4">
                            <DetailField label="Date From" value={leave.from} />
                            <DetailField label="Date To" value={leave.to} />
                            <DetailField label="Filed On" value={leave.filed} />
                            <DetailField label="Total Days" value={leave.days} />
                            
                            <DetailField label="Approved / Rejected By" value={leave.decisionBy} />
                            <DetailField label="Decision Date" value={leave.decisionDate} />
                            <div className="col-span-2">
                              <DetailField label="Remarks from Approver" value={leave.remarks} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default ApprovalLeave;