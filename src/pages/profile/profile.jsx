import React, { useState } from 'react';
import {
  Edit3, User, Briefcase, FileText, CreditCard, Files, Home
} from 'lucide-react';
import StatCard from '../../components/statCard';
import EmploymentInfoTab from './tabs/employmentInfoTab.jsx';
import LeaveCreditsTab   from './tabs/leaveCreditsTab.jsx';
import PayslipsTab       from './tabs/payslipsTab.jsx';
import DocumentsTab      from './tabs/documentsTab.jsx';

// Tab config 
const TABS = [
  { id: 'profile',    label: 'Profile Info',    icon: <User size={15} /> },
  { id: 'employment', label: 'Employment Info',  icon: <Briefcase size={15} /> },
  { id: 'leave',      label: 'Leave Credits',    icon: <Home size={15} /> },
  { id: 'payslips',   label: 'Payslips',         icon: <FileText size={15} /> },
  { id: 'documents',  label: 'Documents',        icon: <Files size={15} /> },
];

// Profile Info Tab 
const ProfileInfoTab = () => (
  <div className="p-6 space-y-6">
    {/* Basic Details */}
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
        <User size={15} className="text-gray-400" />
        <h3 className="font-bold text-sm text-gray-700">Basic Details</h3>
      </div>
      <div className="p-6 grid grid-cols-2 gap-y-10">
        <DetailItem label="Full Name"              value="John Doe" />
        <DetailItem label="Birth Date"             value="July 14, 1998" extra="(27 years old)" />
        <DetailItem label="Civil Status"           value="Single" />
        <DetailItem label="Contact Number"         value="09456732819" />
        <DetailItem label="Residence Address"      value="Mandaluyong City" />
        <DetailItem label="Personal Email Address" value="johndoe@gmail.com" />
      </div>
    </div>

    {/* Primary Identification  */}
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
        <CreditCard size={15} className="text-gray-400" />
        <h3 className="font-bold text-sm text-gray-700">Primary Identification</h3>
      </div>
      <div className="p-6 grid grid-cols-2 gap-y-10">
        <DetailItem label="PhilSys National ID (PCN)" value="1234-5678-9012-3456" />
        <DetailItem label="Passport Number"           value="P1234567A" />
        <DetailItem label="Driver's License"          value="N01-23-456789" />
        <DetailItem label="PRC License"               value="0123456" extra="(Optional)" />
      </div>
    </div>
  </div>
);

//  Main Profile Page 
const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':    return <ProfileInfoTab />;
      case 'employment': return <EmploymentInfoTab />;
      case 'leave':      return <LeaveCreditsTab />;
      case 'payslips':   return <PayslipsTab />;
      case 'documents':  return <DocumentsTab />;
      default:           return null;
    }
  };

  return (
    <div className="space-y-6 pb-10">

      {/* Hero */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex gap-5 items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full border-4 border-gray-50 flex items-center justify-center text-gray-300 shrink-0">
              <User size={40} />
            </div>
            <div className="space-y-2.5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employee No. HSI-008</p>
                <h2 className="text-3xl font-bold text-gray-900">John Doe</h2>
                <p className="text-sm text-gray-500 font-medium">Junior Software Developer</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-green-500 text-white text-[10px] font-bold rounded-md flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active
                </span>
                <span className="px-2.5 py-1 bg-black text-white text-[10px] font-bold rounded-md">On-site</span>
                <span className="px-2.5 py-1 bg-black text-white text-[10px] font-bold rounded-md">Feb 19, 2020</span>
                <span className="px-2.5 py-1 bg-black text-white text-[10px] font-bold rounded-md lowercase">johndoe@highlysucceed.com</span>
              </div>
            </div>
          </div>

          <div className="text-right space-y-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-lg text-xs font-bold hover:bg-yellow-50 transition-colors cursor-pointer ml-auto">
              <Edit3 size={14} /> Edit Record
            </button>
            <div>
              <p className="text-xl font-bold text-yellow-500 leading-none">6 Years 4 Months</p>
              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mt-1">Years of Service</p>
            </div>
          </div>
        </div>
      </div>

      {/*  Stat Cards  */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value="26"       label="Total Days Present"      description="Attendance" />
        <StatCard value="26"       label="Leave Credits Remaining" description="Available" />
        <StatCard value="14h"      label="Time This Month"         description="Overtime" />
        <StatCard value="10:00 AM" label="Required Time In"        description="Daily Shift" />
      </div>

      {/*  Tab Panel  */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200">
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
        {renderTab()}
      </div>
    </div>
  );
};

/*  Helpers  */
const DetailItem = ({ label, value, extra }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">{label}</p>
    <p className="text-sm font-bold text-gray-900">
      {value}{extra && <span className="text-gray-400 font-medium ml-1 text-xs">{extra}</span>}
    </p>
  </div>
);

export default Profile;