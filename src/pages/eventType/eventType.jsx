import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import StatCard from '../../components/statCard'; 

const EventType = () => {
  const [selectedColor, setSelectedColor] = useState('bg-blue-400'); 

  const eventTypes = [
    { name: 'Holiday', desc: 'National and Company declared holidays', applies: 'All Employees', count: 12, color: 'bg-blue-400', status: 'Active' },
    { name: 'Company Event', desc: 'Team events, Outing', applies: 'All Employees', count: 8, color: 'bg-yellow-400', status: 'Active' },
    { name: 'Payroll', desc: 'Payroll cut off', applies: 'All Employees', count: 24, color: 'bg-green-500', status: 'Active' },
    { name: 'Training', desc: 'Scheduled training', applies: 'All Employees', count: 24, color: 'bg-purple-500', status: 'Active' },
    { name: 'Deadline', desc: 'Important submission and Reports', applies: 'Specific Departments', count: 10, color: 'bg-red-500', status: 'Active' },
    { name: 'HR Event', desc: 'Performance reviews', applies: 'All Employees', count: 6, color: 'bg-lime-400', status: 'Active' },
    { name: 'Department Meetings', desc: 'Department discussion', applies: 'Specific Departments', count: 6, color: 'bg-cyan-400', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/*  Header Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">Event Type</h2>
          <p className="text-sm text-gray-400">Manage event categories used in the company calendar</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
          <Download size={18} /> Export
        </button>
      </div>

      {/*  Stat Cards Row */}
      <div className="grid grid-cols-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value="6" label="Total Event Types" description="Across All Categories" />
        <StatCard value="6" label="Activity Types" description="Currently in-use" />
        <StatCard value="4" label="Event this Month" description="Using these types" />
      </div>

      {/* Main Content Grid (Table + Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table Column (70%) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">All Event Types</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-600px">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4 w-20 text-center">Color:</th>
                  <th className="px-6 py-4 w-[20%]">Event Type Name:</th>
                  <th className="px-6 py-4 w-[30%]">Description:</th>
                  <th className="px-6 py-4">Applies To:</th>
                  <th className="px-6 py-4 text-center">Total:</th>
                  <th className="px-6 py-4">Status:</th>
                  <th className="px-6 py-4 text-center">Actions:</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {eventTypes.map((event, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-5 text-center">
                      <div className={`w-4 h-4 rounded-full mx-auto shadow-sm ${event.color}`}></div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-gray-800">{event.name}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[12px] text-gray-500 leading-relaxed max-w-200px">
                        {event.desc}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[12px] font-bold text-gray-700 block">{event.applies}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-[13px] text-gray-500 font-medium">{event.count}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold border border-gray-200 px-2.5 py-1 rounded bg-white shadow-sm uppercase text-gray-600">
                          {event.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="text-gray-300 hover:text-black cursor-pointer p-1 rounded-md hover:bg-gray-100 transition-colors">
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Column (30%) */}
        <div className="lg:col-span-4 bg-gray-200/50 p-5 rounded-xl border border-gray-200 h-fit">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Add new event</h3>
          <form className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type Name</label>
              <input type="text" placeholder="e.g Training, Holiday, Event" className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label>
              <textarea rows="3" placeholder="Brief description of this event type ..." className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 resize-none"></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Applies To</label>
              <select className="w-full p-2 border border-gray-200 rounded text-sm outline-none focus:ring-1 focus:ring-yellow-400">
                <option>All Employees</option>
                <option>Specific Department</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Color Tag</label>
              <div className="flex gap-2 flex-wrap mt-1">
                {[
                  'bg-blue-400', 
                  'bg-yellow-400', 
                  'bg-green-500', 
                  'bg-purple-500', 
                  'bg-red-500', 
                  'bg-lime-400', 
                  'bg-cyan-400'
                ].map((color, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedColor(color)}
                    className={`
                      w-5 h-5 rounded-full ${color} cursor-pointer transition-all
                      ${selectedColor === color 
                        ? 'ring-2 ring-offset-2 ring-black scale-110' 
                        : 'hover:scale-110'
                      }
                    `}
                  ></div>
                ))}
              </div>
            </div>
            <button className="w-full bg-black text-white text-xs font-bold py-2.5 rounded hover:bg-gray-800 transition-colors mt-2">
              Add new event
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default EventType;