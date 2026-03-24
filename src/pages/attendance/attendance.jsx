import React from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import StatCard from '../../components/statCard';

const Attendance = () => {
  const attendanceLogs = [
    { date: 'March 2, 2026', day: 'Monday', status: 'P', timeIn: '8:05 am', timeOut: '6:00 pm', hours: '9 hours', overtime: '-', remarks: '' },
    { date: 'February 27, 2026', day: 'Friday', status: 'P', timeIn: '8:15 am', timeOut: '6:00 pm', hours: '9 hours', overtime: '-', remarks: 'Late 15 min', remarkColor: 'text-red-500' },
    { date: 'February 26, 2026', day: 'Thursday', status: 'P', timeIn: '8:00 am', timeOut: '6:00 pm', hours: '9 hours', overtime: '-', remarks: '' },
    { date: 'February 25, 2026', day: 'Wednesday', status: 'P', timeIn: '8:00 am', timeOut: '6:00 pm', hours: '9 hours', overtime: '-', remarks: '' },
    { date: 'February 24, 2026', day: 'Tuesday', status: 'L', timeIn: '-', timeOut: '-', hours: '-', overtime: '-', remarks: 'Personal Leave', remarkColor: 'text-orange-500' },
  ];

  return (
    <div className="space-y-6 pb-10">
      
      {/* 1. Header Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">My Attendance</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">Your attendance records and time logs</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
            <button className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"><ChevronLeft size={20}/></button>
            <span className="px-4 text-sm font-bold text-gray-700">March 2026</span>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"><ChevronRight size={20}/></button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Black Logged Out Status Bar */}
      <div className="bg-black text-white p-8 rounded-xl shadow-lg flex justify-between items-center relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
            <h3 className="text-3xl font-bold">Logged Out</h3>
          </div>
          <p className="text-xs text-gray-400 font-medium">Time-out recorded at 6:00 pm. See you tomorrow!</p>
          
          <div className="flex gap-12 pt-2">
            <StatusDetail label="TIME IN" value="8:00 am" />
            <StatusDetail label="TIME OUT" value="6:00 pm" />
            <StatusDetail label="Hours Rendered" value="0h 0m" />
            <StatusDetail label="Overtime Hours" value="0h 0m" />
          </div>
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg font-bold text-m transition-all shadow-md active:scale-95 cursor-pointer">
          Time In!
        </button>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value="1" label="Days Present" description="March 2026" />
        <StatCard value="0" label="Days Absent" description="Excused: 0" />
        <StatCard value="0" label="Late Arrivals" description="March 2026" />
        <StatCard value="8" label="Total Hours" description="March 2026" />
        <StatCard value="0" label="On Leave Days" description="March 2026" />
      </div>

      {/*  Attendance Log Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Attendance Log</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-500">Legend:</span>
            <LegendItem dotColor="bg-green-500" label="Present" />
            <LegendItem dotColor="bg-red-500" label="Absent" />
            <LegendItem dotColor="bg-orange-500" label="Leave" />
            <LegendItem dotColor="bg-blue-500" label="Holiday" />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
              <th className="px-6 py-4">Date:</th>
              <th className="px-6 py-4">Day:</th>
              <th className="px-6 py-4">Status:</th>
              <th className="px-6 py-4">Time in:</th>
              <th className="px-6 py-4">Time Out:</th>
              <th className="px-6 py-4">Hours Rendered:</th>
              <th className="px-6 py-4">Overtime:</th>
              <th className="px-6 py-4">Remarks:</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendanceLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-[13px] text-gray-800 font-medium">{log.date}</td>
                <td className="px-6 py-4 text-[13px] text-gray-500">{log.day}</td>
                <td className="px-6 py-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${
                    log.status === 'P' ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {log.status}
                  </div>
                </td>
                <td className="px-6 py-4 text-[13px] text-gray-700">{log.timeIn}</td>
                <td className="px-6 py-4 text-[13px] text-gray-700">{log.timeOut}</td>
                <td className="px-6 py-4 text-[13px] text-gray-700">{log.hours}</td>
                <td className="px-6 py-4 text-[13px] text-gray-500">{log.overtime}</td>
                <td className={`px-6 py-4 text-[12px] font-bold ${log.remarkColor || 'text-gray-400'}`}>
                  {log.remarks || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- Helpers --- */

const StatusDetail = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-bold">{value.split(' ')[0]}</span>
      <span className="text-xs font-bold text-gray-400">{value.split(' ')[1]}</span>
    </div>
  </div>
);

const LegendItem = ({ dotColor, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 rounded-full ${dotColor} flex items-center justify-center text-[8px] text-white font-bold`}>
      {label.charAt(0)}
    </div>
    <span className="text-[11px] text-gray-400 font-medium">{label}</span>
  </div>
);

export default Attendance;