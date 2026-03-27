import React, { useState } from 'react';
import { Clock, Home, FileText, ChevronDown, Download } from 'lucide-react'; 

import ApprovalOvertime from './tabs/approvalOvertime.jsx';
import ApprovalLeave from './tabs/approvalLeave.jsx';
import AttendanceSummary from './tabs/attendanceSummary.jsx';

const TABS = [
  { id: 'overtime', label: 'Approval : Overtime', icon: <Clock size={15} /> },
  { id: 'leave',    label: 'Approval : Leave',    icon: <Home size={15} /> },
  { id: 'summary',  label: 'Attendance Summary',  icon: <FileText size={15} /> },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overtime');
  const [monthFilter, setMonthFilter] = useState('March 2026'); 

  const renderTab = () => {
    switch (activeTab) {
      case 'overtime': return <ApprovalOvertime />;
      case 'leave':    return <ApprovalLeave />;
      case 'summary':  return <AttendanceSummary />;
      default:         return null;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">My Reports</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">Your personal HR and summaries.</p>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          
          {/* Month Filter */}
          <div className="relative">
            <select 
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer text-gray-700"
            >
              <option>March 2026</option>
              <option>February 2026</option>
              <option>January 2026</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Export PDF Button */}
          <button className="flex items-center gap-2 border border-gray-200 bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer active:scale-[0.98]">
            <Download size={16} />
            Export PDF
          </button>

        </div>
      </div>

      {/* Tab Panel */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Tab Bar*/}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-black border-yellow-400 bg-white'
                  : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50/50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTab()}
        </div>

      </div>
    </div>
  );
};

export default Reports;