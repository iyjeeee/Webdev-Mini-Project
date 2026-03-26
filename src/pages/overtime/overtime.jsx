import React from 'react';
import { ChevronDown } from 'lucide-react';
import StatCard from '../../components/statCard';
import { DatePickerInput, TimePickerInput } from '../../components/formInputs.jsx';

const Overtime = () => {
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
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value="5" label="TOTAL FILED" description="All Time" />
        <StatCard value="14h" label="APPROVED HOURS" description="All approved OT" />
        <StatCard value="2" label="PENDING" description="Awaiting approval" />
        <StatCard value="0" label="REJECTED" description="All Time" />
      </div>

      {/* File New OT Form */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">File New Overtime Request</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Using the Date Picker Component */}
            <DatePickerInput 
              label="Date of Overtime" 
              defaultValue="2026-03-02" 
            />
            
            {/* Using the Time Picker Components */}
            <TimePickerInput 
              label="Start Time" 
              defaultValue="17:00" 
            />
            
            <TimePickerInput 
              label="End Time" 
              defaultValue="19:00" 
            />

          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-end">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Reason / Description</label>
                <textarea 
                  rows="2" 
                  placeholder="Briefly describe the reason for overtime work..." 
                  className="w-full p-3 border border-gray-900 rounded-lg text-sm outline-none transition-colors focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 resize-none"
                ></textarea>
              </div>
              <button className="ml-4 mb-1 bg-black text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all cursor-pointer">
                Submit Request
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Overtime History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Overtime History</h3>
          <span className="text-[10px] text-gray-400 font-medium">Showing all records</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-[10px] uppercase tracking-tighter text-gray-900 font-black">
              <th className="px-4 py-4">Reference No.</th>
              <th className="px-4 py-4">Date</th>
              <th className="px-4 py-4">Day</th>
              <th className="px-4 py-4">OT Start</th>
              <th className="px-4 py-4">OT End</th>
              <th className="px-4 py-4">Total Hours</th>
              <th className="px-4 py-4">Reason</th>
              <th className="px-4 py-4">Filed On</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Approved By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {otHistory.map((ot, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-[11px] font-bold text-gray-900">{ot.ref}</td>
                <td className="px-4 py-4 text-[11px] text-gray-900">{ot.date}</td>
                <td className="px-4 py-4 text-[11px] text-gray-900">{ot.day}</td>
                <td className="px-4 py-4 text-[11px] font-bold text-gray-900">{ot.start}</td>
                <td className="px-4 py-4 text-[11px] font-bold text-gray-900">{ot.end}</td>
                <td className="px-4 py-4 text-[11px] text-gray-900">{ot.total}</td>
                <td className="px-4 py-4 text-[11px] text-gray-900 truncate max-w-[150px]">{ot.reason}</td>
                <td className="px-4 py-4 text-[11px] font-bold text-gray-900">{ot.filed}</td>
                <td className="px-4 py-4">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-bold shadow-sm ${
                    ot.status === 'Approved' ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'
                  }`}>
                    {ot.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-[11px] font-bold text-gray-900">{ot.approvedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overtime;