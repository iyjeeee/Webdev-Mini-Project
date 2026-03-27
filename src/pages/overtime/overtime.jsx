import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import StatCard from '../../components/statCard';
import OvertimeRequestModal from './overtimeRequestModal.jsx'; 

const STATUS_STYLE = {
  Approved:  'bg-green-500 text-white',
  Rejected:  'bg-red-500 text-white',
  Pending:   'bg-yellow-400 text-white',
  Cancelled: 'bg-gray-400 text-white',
};

const Overtime = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const otHistory = [
    { ref: 'OT-2026-005', date: 'March 02, 2026', day: 'Monday', start: '5 : 00 PM', end: '7 : 00 PM', total: '2h 00m', reason: 'Urgent deployment fix', filed: 'March 02, 2026', status: 'Pending', approvedBy: '----------' },
    { ref: 'OT-2026-004', date: 'Feb 26, 2026', day: 'Thursday', start: '5 : 00 PM', end: '6 : 02 PM', total: '1h 02m', reason: 'Sprint deadline completion', filed: 'Feb 26, 2026', status: 'Pending', approvedBy: '----------' },
    { ref: 'OT-2026-003', date: 'Feb 25, 2026', day: 'Wednesday', start: '5 : 00 PM', end: '6 : 00 PM', total: '1h 00m', reason: 'Sprint deadline completion', filed: 'Feb 25, 2026', status: 'Approved', approvedBy: 'Reginald Aquino' },
    { ref: 'OT-2026-002', date: 'Feb 24, 2026', day: 'Tuesday', start: '5 : 00 PM', end: '8 : 00 PM', total: '3h 00m', reason: 'Bug Fixing and Testing', filed: 'Feb 24, 2026', status: 'Approved', approvedBy: 'Juan Dela Cruz' },
    { ref: 'OT-2026-001', date: 'Feb 20, 2026', day: 'Friday', start: '5 : 00 PM', end: '7 : 02 PM', total: '1h 02m', reason: 'Deploying system updates', filed: 'Feb 20, 2026', status: 'Approved', approvedBy: 'Anna Patricia Lopez' },
  ];

  return (
    <div className="space-y-4 pb-10">
      
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">My Overtime</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">Your overtime filings and approval status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer">
                <option>All Status</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer">
                <option>March 2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* New Header Button */}
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            + File Overtime
          </button>

        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value="5" label="TOTAL FILED" description="All Time" />
        <StatCard value="14h" label="APPROVED HOURS" description="All approved OT" />
        <StatCard value="2" label="PENDING" description="Awaiting approval" />
        <StatCard value="0" label="REJECTED" description="All Time" />
      </div>

      {/* Overtime History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Overtime History</h3>
          <span className="text-[10px] text-gray-400 font-medium">Showing all records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] uppercase tracking-tighter text-gray-400 font-bold">
                <th className="px-5 py-3 whitespace-nowrap">Reference No.</th>
                <th className="px-5 py-3 whitespace-nowrap">Date</th>
                <th className="px-5 py-3 whitespace-nowrap">Day</th>
                <th className="px-5 py-3 whitespace-nowrap">OT Start</th>
                <th className="px-5 py-3 whitespace-nowrap">OT End</th>
                <th className="px-5 py-3 whitespace-nowrap">Total Hours</th>
                <th className="px-5 py-3 whitespace-nowrap">Reason</th>
                <th className="px-5 py-3 whitespace-nowrap">Filed On</th>
                <th className="px-5 py-3 whitespace-nowrap">Status</th>
                <th className="px-5 py-3 whitespace-nowrap">Approved By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {otHistory.map((ot, index) => (
                <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-3.5 text-[11px] font-mono text-gray-500 whitespace-nowrap">{ot.ref}</td>
                  <td className="px-5 py-3.5 text-[11px] text-gray-600 whitespace-nowrap">{ot.date}</td>
                  <td className="px-5 py-3.5 text-[11px] text-gray-600 whitespace-nowrap">{ot.day}</td>
                  <td className="px-5 py-3.5 text-[11px] font-bold text-gray-900 whitespace-nowrap">{ot.start}</td>
                  <td className="px-5 py-3.5 text-[11px] font-bold text-gray-900 whitespace-nowrap">{ot.end}</td>
                  <td className="px-5 py-3.5 text-[11px] font-semibold text-gray-700 whitespace-nowrap">{ot.total}</td>
                  <td className="px-5 py-3.5 text-[11px] text-gray-600 truncate max-w-[150px]">{ot.reason}</td>
                  <td className="px-5 py-3.5 text-[11px] text-gray-500 whitespace-nowrap">{ot.filed}</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${STATUS_STYLE[ot.status] ?? 'bg-gray-200 text-gray-600'}`}>
                      {ot.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[11px] font-semibold text-gray-700 whitespace-nowrap">{ot.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      <OvertimeRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
};

export default Overtime;