import React from 'react';
import { Search, Download, Plus, Filter } from 'lucide-react';
import StatCard from '../../components/statCard.jsx';

const Directory = () => {
  const employees = [
    { id: 'HS-001', name: 'Juan Dela Cruz', email: 'juandelacruz@highlysucceed.com', phone: '09457651267', dept: 'Developer', pos: 'Lead Software Developer', date: 'Jan 15, 2023', exp: '3 Years', arrangement: 'On-site', status: 'Active' },
    { id: 'HS-002', name: 'John Doe', email: 'johndoe@highlysucceed.com', phone: '09276783546', dept: 'Project Management', pos: 'Project Management Head', date: 'Feb 15, 2022', exp: '4 Years', arrangement: 'Hybrid', status: 'Active' },
    { id: 'HS-003', name: 'Eva Smith', email: 'evasmith@highlysucceed.com', phone: '09954647823', dept: 'Finance', pos: 'Finance Analyst', date: 'Sept 20, 2022', exp: '4 Years', arrangement: 'Hybrid', status: 'Leave' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employee Directory</h2>
            <p className="text-sm text-gray-400">All employees across departments - Highly Succeed, Inc.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer">
              <Download size={18} /> Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 cursor-pointer">
              <Plus size={18} /> Add Employee
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-300px">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID, Department ..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm"
            />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer">
            <option>All Departments</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer">
            <option>All Status</option>
          </select>
          <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer">
            <option>All Arrangement</option>
          </select>
        </div>
      </div>

      {/* 2. Stat Cards Row */}
      <div className="grid grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value="18" label="Total Employees" description="Across All Departments" />
        <StatCard value="14" label="Active" description="Currently Working" />
        <StatCard value="2" label="Leave" description="Approved leave" />
        <StatCard value="2" label="On Probation" description="New hires" />
      </div>

      {/* 3. Employee Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
              <th className="px-6 py-4">Employee:</th>
              <th className="px-6 py-4">Contact:</th>
              <th className="px-6 py-4">Department:</th>
              <th className="px-6 py-4">Position:</th>
              <th className="px-6 py-4">Date Hired:</th>
              <th className="px-6 py-4">Arrangement:</th>
              <th className="px-6 py-4">Status:</th>
              <th className="px-6 py-4 ">Actions:</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{emp.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">{emp.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[13px] text-gray-700 leading-tight">{emp.email}</p>
                  <p className="text-[11px] text-gray-400">{emp.phone}</p>
                </td>
                <td className="px-6 py-4 text-[13px] font-bold text-gray-700">{emp.dept}</td>
                <td className="px-6 py-4">
                  <p className="text-[12px] font-medium text-gray-700 leading-tight">{emp.pos}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[12px] font-bold text-gray-700">{emp.date}</p>
                  <p className="text-[11px] text-gray-400">{emp.exp}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-600 rounded-md text-[10px] font-bold uppercase">
                    {emp.arrangement}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${emp.status === 'Active' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                    <span className="text-[11px] font-bold text-gray-700">{emp.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-gray-400 hover:text-black cursor-pointer">•••</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Directory;