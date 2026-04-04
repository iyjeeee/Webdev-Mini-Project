import React, { useState } from 'react';
import AttendanceSummary from './tabs/attendanceSummary.jsx';
import ApprovalLeave     from './tabs/approvalLeave.jsx';
import ApprovalOvertime  from './tabs/approvalOvertime.jsx';

// Tab configuration
const TABS = [
  { key: 'attendance', label: 'Attendance Summary' },
  { key: 'leave',      label: 'Leave Report'       },
  { key: 'overtime',   label: 'Overtime Report'    },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('attendance'); // default first tab

  return (
    <div className="space-y-6 pb-10">

      {/* Page Header */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">My Report</h2>
        <p className="text-sm text-gray-400 mt-1">Attendance, leave, and overtime summaries</p>
      </div>

      {/* Tab Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-bold transition-colors cursor-pointer border-b-2 ${
                activeTab === tab.key
                  ? 'border-yellow-400 text-gray-900 bg-yellow-50/40'
                  : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'attendance' && <AttendanceSummary />}
          {activeTab === 'leave'      && <ApprovalLeave />}
          {activeTab === 'overtime'   && <ApprovalOvertime />}
        </div>
      </div>
    </div>
  );
};

export default Reports;
