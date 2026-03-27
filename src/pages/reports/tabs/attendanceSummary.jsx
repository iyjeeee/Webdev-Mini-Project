import React from 'react';
import StatCard from '../../../components/statCard'; 

const STATUS_STYLE = {
  'Present':  'bg-green-500 text-white',  
  'Absent':   'bg-red-500 text-white',     
  'On Leave': 'bg-yellow-400 text-white',  
  'Rest Day': 'bg-gray-400 text-white',   
  'Holiday':  'bg-blue-500 text-white',    
};

const MOCK_ATTENDANCE = [
  { date: 'March 2, 2026', day: 'Monday', status: 'Present', timeIn: '8:02 AM', timeOut: '5:05 PM', hours: '9h 03m', ot: '1h 03m', late: '---' },
  { date: 'March 1, 2026', day: 'Sunday', status: 'Rest Day', timeIn: '---', timeOut: '---', hours: '---', ot: '---', late: '---' },
  { date: 'Feb 27, 2026', day: 'Friday', status: 'Present', timeIn: '7:55 AM', timeOut: '4:00 PM', hours: '8h 05m', ot: '---', late: '---' },
];

const AttendanceSummary = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/*  Stat Cards */}
      <div className="grid grid-cols-5 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200">
        <StatCard value="20"  label="WORKING DAYS" description="March 2026 Expected" />
        <StatCard value="2"   label="PRESENT"      description="Days Attended" />
        <StatCard value="0"   label="ABSENT"       description="No Absences" />
        <StatCard value="0"   label="LATE"         description="Late Arrivals" />
        <StatCard value="17h" label="TOTAL HOURS"  description="Rendered This Month" />
      </div>

      {/*  Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Attendance Table (Takes 2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/30">
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Daily Attendance Summary — March 2026</h3>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-[9px] uppercase tracking-wider text-gray-800 font-black">
                  <th className="px-5 py-4 whitespace-nowrap">Date</th>
                  <th className="px-5 py-4 whitespace-nowrap">Day</th>
                  <th className="px-5 py-4 whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 whitespace-nowrap">Time In</th>
                  <th className="px-5 py-4 whitespace-nowrap">Time Out</th>
                  <th className="px-5 py-4 whitespace-nowrap">Hours Rendered</th>
                  <th className="px-5 py-4 whitespace-nowrap">OT Hours</th>
                  <th className="px-5 py-4 whitespace-nowrap">Late</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ATTENDANCE.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{record.date}</td>
                    <td className="px-5 py-4 text-[10px] text-gray-900 font-bold whitespace-nowrap">{record.day}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold shadow-sm ${STATUS_STYLE[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{record.timeIn}</td>
                    <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{record.timeOut}</td>
                    <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{record.hours}</td>
                    <td className="px-5 py-4 text-[10px] font-bold text-gray-900 whitespace-nowrap">{record.ot}</td>
                    <td className="px-5 py-4 text-[10px] font-bold text-gray-400 whitespace-nowrap">{record.late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Totals */}
          <div className="mt-auto border-t border-gray-200 bg-gray-50/50 p-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-900">Monthly Totals</span>
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-gray-500 font-bold">Present: <span className="text-gray-900">2 days</span></span>
              <span className="text-[10px] text-gray-500 font-bold">Hours: <span className="text-gray-900">17h 08m</span></span>
              <span className="text-[10px] text-gray-500 font-bold">OT: <span className="text-gray-900">1h 03m</span></span>
            </div>
          </div>
        </div>

        {/* Right Side: Calendar View  */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-6">March 2026 Calendar View</h3>
          
          {/* Calendar Grid */}
          <div className="mb-8">
            <div className="grid grid-cols-7 mb-4 text-center">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="text-[8px] font-black text-gray-800">{day}</div>
              ))}
            </div>
            
            {/* March 2026 Dates */}
            <div className="grid grid-cols-7 gap-y-4 text-center text-[10px] font-bold text-gray-700">
              <div className="bg-gray-400 rounded text-white mx-auto w-6 h-6 flex items-center justify-center shadow-sm">1</div> {/* Rest Day */}
              <div className="bg-green-500 rounded text-white mx-auto w-6 h-6 flex items-center justify-center shadow-sm">2</div> {/* Present */}
              <div>3</div><div>4</div><div>5</div><div>6</div><div>7</div>
              <div>8</div><div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div>
              <div>15</div><div>16</div><div>17</div><div>18</div><div>19</div><div>20</div><div>21</div>
              <div>22</div><div>23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div>
              <div>29</div><div>30</div><div>31</div>
            </div>
          </div>

          {/* legend colors */}
          <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-[10px] font-bold text-gray-800">Present</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-[10px] font-bold text-gray-800">Absent</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-yellow-400"></div>
              <span className="text-[10px] font-bold text-gray-800">On Leave</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-[10px] font-bold text-gray-800">Holiday</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-gray-400"></div>
              <span className="text-[10px] font-bold text-gray-800">Rest Day</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceSummary;