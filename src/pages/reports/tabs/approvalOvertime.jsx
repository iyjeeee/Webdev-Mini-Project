import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import StatCard from '../../../components/statCard'; 

const STATUS_STYLE = {
  Approved:  'bg-green-500 text-white',
  Rejected:  'bg-red-500 text-white',
  Pending:   'bg-yellow-400 text-white',
  Cancelled: 'bg-gray-400 text-white',
};

const MOCK_HISTORY = [
  { ref: 'OT-2026-005', date: 'March 02, 2026', day: 'Monday', start: '5:00 PM', end: '7:00 PM', total: '2h 00m', reason: 'Urgent deployment fix', filed: 'March 02, 2026', status: 'Pending', decisionBy: '----------', decisionDate: '----------', remarks: '----------' },
  { ref: 'OT-2026-004', date: 'Feb 26, 2026', day: 'Thursday', start: '5:00 PM', end: '6:02 PM', total: '1h 02m', reason: 'Sprint deadline completion', filed: 'Feb 26, 2026', status: 'Pending', decisionBy: '----------', decisionDate: '----------', remarks: '----------' },
  { ref: 'OT-2026-003', date: 'Feb 25, 2026', day: 'Wednesday', start: '5:00 PM', end: '6:00 PM', total: '1h 00m', reason: 'Sprint deadline completion', filed: 'Feb 25, 2026', status: 'Approved', decisionBy: 'Reginald Aquino', decisionDate: 'Feb 26, 2026', remarks: '----------' },
  { ref: 'OT-2026-002', date: 'Feb 24, 2026', day: 'Tuesday', start: '5:00 PM', end: '8:00 PM', total: '3h 00m', reason: 'Bug Fixing and Testing', filed: 'Feb 24, 2026', status: 'Approved', decisionBy: 'Juan Dela Cruz', decisionDate: 'Feb 25, 2026', remarks: '----------' },
  { ref: 'OT-2026-001', date: 'Feb 20, 2026', day: 'Friday', start: '5:00 PM', end: '7:02 PM', total: '2h 02m', reason: 'Deploying system updates', filed: 'Feb 20, 2026', status: 'Approved', decisionBy: 'Anna Patricia Lopez', decisionDate: 'Feb 21, 2026', remarks: '----------' },
  { ref: 'OT-2026-001', date: 'Feb 18, 2026', day: 'Wednesday', start: '5:00 PM', end: '8:00 PM', total: '3h 00m', reason: 'Restoring system downtime', filed: 'Feb 18, 2026', status: 'Approved', decisionBy: 'Christine Joy Ramos', decisionDate: 'Feb 19, 2026', remarks: '----------' },
];

// Helper component for the expanded details
const DetailField = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xs font-bold text-gray-900">{value}</p>
  </div>
);

const ApprovalOvertime = () => {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null); 
    } else {
      setExpandedRow(index); 
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200">
        <StatCard value="5"   label="TOTAL FILED"    description="All Time" />
        <StatCard value="3"   label="APPROVED"       description="14h total approved" />
        <StatCard value="2"   label="PENDING"        description="Awaiting approval" />
        <StatCard value="0"   label="REJECTED"       description="All Time" />
      </div>

      {/* Overtime History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Overtime History</h3>
          <span className="text-[10px] text-gray-400 font-medium">Click a row to view full details</span>
        </div>

        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-[9px] uppercase tracking-wider text-gray-800 font-black">
                <th className="px-5 py-4 whitespace-nowrap">Reference No.</th>
                <th className="px-5 py-4 whitespace-nowrap">Date</th>
                <th className="px-5 py-4 whitespace-nowrap">Total Hours</th>
                <th className="px-5 py-4 whitespace-nowrap w-1/3">Reason</th>
                <th className="px-5 py-4 whitespace-nowrap">Status</th>
                <th className="px-5 py-4 whitespace-nowrap text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_HISTORY.map((ot, index) => {
                const isExpanded = expandedRow === index;

                return (
                  <React.Fragment key={index}>
                    {/* Main Row */}
                    <tr 
                      onClick={() => toggleRow(index)}
                      className={`transition-colors cursor-pointer ${isExpanded ? 'bg-yellow-50/30' : 'hover:bg-gray-50/80'}`}
                    >
                      <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{ot.ref}</td>
                      <td className="px-5 py-4 text-[10px] text-gray-900 font-bold whitespace-nowrap">{ot.date}</td>
                      <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{ot.total}</td>
                      <td className="px-5 py-4 text-[10px] text-gray-900 font-bold truncate max-w-[200px]" title={ot.reason}>{ot.reason}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLE[ot.status] ?? 'bg-gray-200 text-gray-600'}`}>
                          {ot.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-gray-400">
                        {isExpanded ? <ChevronUp size={16} className="inline-block" /> : <ChevronDown size={16} className="inline-block" />}
                      </td>
                    </tr>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <tr className="bg-gray-50/50 border-b border-gray-200">
                        <td colSpan="6" className="px-5 py-6">
                          <div className="grid grid-cols-4 gap-y-6 gap-x-4">
                            <DetailField label="Day of Week" value={ot.day} />
                            <DetailField label="OT Start Time" value={ot.start} />
                            <DetailField label="OT End Time" value={ot.end} />
                            <DetailField label="Filed On" value={ot.filed} />
                            
                            <DetailField label="Decision By" value={ot.decisionBy} />
                            <DetailField label="Decision Date" value={ot.decisionDate} />
                            <div className="col-span-2">
                              <DetailField label="Remarks from Approver" value={ot.remarks} />
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

export default ApprovalOvertime;