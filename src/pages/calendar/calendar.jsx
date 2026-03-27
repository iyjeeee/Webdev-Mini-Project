import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EVENTS = [
  { id: 1, date: new Date(), title: 'Today', subtitle: 'Monday - Work Day', type: 'Today' },
  { id: 2, date: new Date(2026, 2, 23), title: "International Women's Day", subtitle: 'National Holiday - Regular Holiday', type: 'Holiday' },
  { id: 3, date: new Date(2026, 3, 5), title: 'Company Teambuilding', subtitle: 'Whole Day - Venue TBA', type: 'Company Event' },
  { id: 4, date: new Date(2026, 4, 15), title: 'Payroll Cutoff', subtitle: 'Payroll Period', type: 'Payroll' },
  { id: 5, date: new Date(2026, 5, 9), title: 'Q1 Performance Review', subtitle: 'HR Event - End of Q1', type: 'HR Event' },
];

const Calendar = () => {
  // Initialized to March 2026 to match your screenshot, but logic remains live-accurate
  const [viewDate, setViewDate] = useState(new Date(2026, 2, 1));
  const realToday = new Date();

  const handleMonthChange = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    
    const cells = [];
    // Prev Month
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
    // Current Month
    for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, current: true });
    // Next Month
    while (cells.length < 42) cells.push({ day: cells.length - (firstDay + daysInMonth) + 1, current: false });
    return cells;
  };

  return (
    <div className="flex gap-8 h-full">
      {/* LEFT: CALENDAR SECTION */}
      <div className="flex-[3] min-w-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
            <p className="text-sm text-gray-400">Company events, holidays, and important dates - visible to all employees</p>
          </div>

          <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="text-[12px] font-black text-gray-700 uppercase tracking-widest min-w-[110px] text-center">
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* THE GRID: Accurate to Screenshot */}
        <div className="bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col flex-1">
          {/* Week Headers */}
          <div className="grid grid-cols-7 bg-white border-b border-gray-200">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
              <div key={day} className="py-3 text-center text-[10px] font-black text-gray-300 tracking-widest uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid: Uses gap to create perfectly accurate 1px lines */}
          <div className="grid grid-cols-7 flex-1 gap-[1px] bg-gray-200">
            {renderDays().map((cell, idx) => {
              const isToday = cell.day === realToday.getDate() && 
                              viewDate.getMonth() === realToday.getMonth() && 
                              cell.current;
              
              const isHoliday = cell.day === 23 && viewDate.getMonth() === 2 && cell.current;

              return (
                <div 
                  key={idx} 
                  className={`p-3 relative transition-colors ${cell.current ? 'bg-white' : 'bg-gray-50/50 text-gray-200'}`}
                >
                  <span className={`text-[11px] font-bold ${
                    isToday ? 'bg-[#FFCC00] text-black px-1.5 py-0.5 rounded shadow-sm' : 
                    cell.current ? 'text-gray-400' : 'text-gray-200'
                  }`}>
                    {cell.day}
                  </span>

                  {isHoliday && (
                    <div className="mt-2 bg-[#FFFDE7] border-l-4 border-yellow-400 p-1 rounded-sm">
                      <p className="text-[8px] font-black text-yellow-800 leading-tight">International Women's Day</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LEGEND: Matching Screenshot Colors */}
        <div className="mt-4 flex items-center gap-6">
          {[
            { label: 'Holiday', color: 'bg-yellow-400' },
            { label: 'Company Events', color: 'bg-blue-400' },
            { label: 'Payroll', color: 'bg-green-400' },
            { label: 'Today', color: 'bg-yellow-200' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm border border-gray-100 ${item.color}`}></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: UPCOMING EVENTS */}
      <div className="w-[300px] shrink-0">
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Upcoming Events</h2>
        <div className="space-y-3">
          {EVENTS.map((ev) => (
            <div key={ev.id} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-4 min-w-[50px]">
                <span className="text-lg font-black text-gray-800 leading-none">
                  {ev.date.getDate().toString().padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold text-gray-300 uppercase">
                  {ev.date.toLocaleString('default', { month: 'short' })}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-800 truncate">{ev.title}</p>
                <p className="text-[10px] text-gray-400 mb-2 truncate">{ev.subtitle}</p>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase border 
                  ${ev.type === 'Holiday' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  • {ev.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;