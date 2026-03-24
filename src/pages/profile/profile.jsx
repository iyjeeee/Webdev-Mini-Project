import React from 'react';
import { 
  Edit3, User, Briefcase, FileText, CreditCard, Files, Home 
} from 'lucide-react';
import StatCard from '../../components/statCard';

const Profile = () => {
  return (
    <div className="space-y-6 pb-10">
      
      {/*  Profile Hero Section */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex gap-6 items-center">
            {/* Avatar Placeholder */}
            <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-gray-50 flex items-center justify-center text-gray-300 shrink-0">
              <User size={48} />
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employee No. HSI-008</p>
                <h2 className="text-3xl font-bold text-gray-900">John Doe</h2>
                <p className="text-sm text-gray-500 font-medium">Junior Software Developer</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-md flex items-center gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div> Active
                </span>
                <span className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-md">On-site</span>
                <span className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-md uppercase tracking-tighter">Feb 19, 2020</span>
                <span className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-md lowercase">johndoe@highlysucceed.com</span>
              </div>
            </div>
          </div>

          <div className="text-right space-y-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-lg text-xs font-bold hover:bg-yellow-50 transition-colors cursor-pointer ml-auto">
              <Edit3 size={16} /> Edit Record
            </button>
            <div>
              <p className="text-2xl font-bold text-yellow-500 leading-none tracking-tight">6 Years 4 Months</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Years of Service</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Stat Cards Row (Plain White Setup) */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value="26" label="Total Days Present" description="Attendance" />
        <StatCard value="26" label="Leave Credits Remaining" description="Available" />
        <StatCard value="14h" label="Time This Month" description="Overtime" />
        <StatCard value="10:00 AM" label="Required Time In" description="Daily Shift" />
      </div>

      {/* 3. Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <TabItem icon={<User size={16}/>} label="Profile Info" active />
          <TabItem icon={<Briefcase size={16}/>} label="Employment Info" />
          <TabItem icon={<Home size={16}/>} label="Leave Credits" />
          <TabItem icon={<FileText size={16}/>} label="Payslips" />
          <TabItem icon={<Files size={16}/>} label="Documents" />
        </div>

        {/* 4. Details Sections */}
        <div className="p-6 space-y-6">
          
          {/* Basic Details Box */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <h3 className="font-bold text-sm text-gray-700">Basic Details</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-10">
              <DetailItem label="Full Name" value="John Doe" />
              <DetailItem label="Birth Date" value="July 14, 1998" extra="(27 years old)" />
              <DetailItem label="Civil Status" value="Single" />
              <DetailItem label="Contact Number" value="09456732819" />
              <DetailItem label="Residence Address" value="Mandaluyong City" />
              <DetailItem label="Personal Email Address" value="johndoe@gmail.com" />
            </div>
          </div>

          {/* Government ID Numbers Box */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
              <CreditCard size={16} className="text-gray-400" />
              <h3 className="font-bold text-sm text-gray-700">Government ID Numbers</h3>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-10">
              <DetailItem label="SSS Number" value="34-12346-102" />
              <DetailItem label="PhilHealth Number" value="1234-23467-123" />
              <DetailItem label="Pag-IBIG Number" value="1234-2938-2341" />
              <DetailItem label="Tax Identification Number" value="123-234-234-1" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* --- Helpers --- */

const TabItem = ({ icon, label, active }) => (
  <button className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all cursor-pointer border-b-2 ${
    active ? 'text-black border-yellow-500 bg-white' : 'text-gray-400 border-transparent hover:text-gray-600'
  }`}>
    {icon} {label}
  </button>
);

const DetailItem = ({ label, value, extra }) => (
  <div>
    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">{label}</p>
    <p className="text-sm font-bold text-gray-900">
      {value} {extra && <span className="text-gray-400 font-medium ml-1 text-xs">{extra}</span>}
    </p>
  </div>
);

export default Profile;