import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarEvents } from '../../api/calendarApi.js';

const Calendar = () => {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null); // { day, events }
  const realToday = new Date();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const month = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`;
      const res = await getCalendarEvents({ month });
      setEvents(res.data || []);
    } catch { setEvents([]); }
    finally { setLoading(false); }
  }, [viewDate]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  useEffect(() => { setSelectedDay(null); }, [viewDate]);

  const handleMonthChange = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const getEventsForDay = (day) =>
    events.filter((ev) => {
      const d = new Date(ev.start_date);
      return d.getUTCDate() === day &&
             d.getUTCMonth() === viewDate.getMonth() &&
             d.getUTCFullYear() === viewDate.getFullYear();
    });

  const buildCells = () => {
    const year      = viewDate.getFullYear();
    const month     = viewDate.getMonth();
    const firstDay  = new Date(year, month, 1).getDay();
    const daysInMon = new Date(year, month + 1, 0).getDate();
    const daysInPrev= new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
    for (let i = 1; i <= daysInMon; i++)    cells.push({ day: i, current: true });
    let next = 1;
    while (cells.length < 42) cells.push({ day: next++, current: false });
    return cells;
  };

  const cells = buildCells();

  // Sidebar: all events for month sorted by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  return (
    <div className="flex gap-6 pb-10 min-h-[600px]">

      {/* LEFT: Calendar */}
      <div className="flex-[3] min-w-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
            <p className="text-sm text-gray-400">Company events, holidays, and important dates</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <span className="text-[12px] font-black text-gray-700 uppercase tracking-widest min-w-[130px] text-center">
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex-1 flex flex-col">
          {/* Week headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((d) => (
              <div key={d} className="py-3 text-center text-[10px] font-black text-gray-400 tracking-widest uppercase">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: '1fr' }}>
            {cells.map((cell, idx) => {
              const isToday = cell.current &&
                              cell.day === realToday.getDate() &&
                              viewDate.getMonth()    === realToday.getMonth() &&
                              viewDate.getFullYear() === realToday.getFullYear();
              const dayEvents = cell.current ? getEventsForDay(cell.day) : [];
              const isSelected = selectedDay?.day === cell.day && cell.current;

              return (
                <div
                  key={idx}
                  onClick={() => cell.current && setSelectedDay(
                    isSelected ? null : { day: cell.day, events: dayEvents }
                  )}
                  className={`border-b border-r border-gray-100 p-1.5 flex flex-col min-h-[80px] transition-colors relative
                    ${cell.current ? 'cursor-pointer hover:bg-yellow-50' : 'opacity-30 bg-gray-50'}
                    ${isSelected ? 'bg-yellow-50 ring-2 ring-yellow-400 ring-inset' : ''}
                  `}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 shrink-0
                    ${isToday ? 'bg-yellow-400 text-black shadow-sm' : 'text-gray-600'}
                  `}>
                    {cell.day}
                  </div>

                  {/* Event labels — show up to 2, then "+N" */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev, i) => {
                      const color = ev.event_type_color || '#6B7280';
                      return (
                        <div key={i}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded truncate leading-tight"
                          style={{ backgroundColor: color + '25', color, border: `1px solid ${color}40` }}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-gray-400 font-bold px-1">+{dayEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        {selectedDay && selectedDay.events.length > 0 && (
          <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Events on {viewDate.toLocaleString('default', { month: 'long' })} {selectedDay.day}
            </p>
            <div className="space-y-2">
              {selectedDay.events.map((ev) => {
                const color = ev.event_type_color || '#6B7280';
                return (
                  <div key={ev.id} className="flex items-start gap-3 p-3 rounded-lg border"
                    style={{ borderColor: color + '40', backgroundColor: color + '10' }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: color }} />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{ev.title}</p>
                      <p className="text-[10px] font-bold uppercase" style={{ color }}>{ev.event_type_name}</p>
                      {ev.location && <p className="text-[11px] text-gray-400 mt-0.5">📍 {ev.location}</p>}
                      {ev.description && <p className="text-xs text-gray-500 mt-1">{ev.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Sidebar */}
      <div className="w-72 shrink-0 flex flex-col gap-4">
        {/* Today */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Today</p>
          <p className="text-lg font-black text-gray-900">
            {realToday.toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
          <p className="text-sm text-gray-500">
            {realToday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* This Month's Events */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-widest">This Month</h3>
            <span className="text-[10px] text-gray-400 font-bold">{events.length} event{events.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="divide-y divide-gray-50 overflow-y-auto max-h-[380px]">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : sortedEvents.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400">No events this month.</div>
            ) : (
              sortedEvents.map((ev) => {
                const d     = new Date(ev.start_date);
                const day   = d.getUTCDate().toString().padStart(2, '0');
                const mon   = d.toLocaleString('default', { month: 'short', timeZone: 'UTC' }).toUpperCase();
                const color = ev.event_type_color || '#6B7280';
                return (
                  <div key={ev.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 border"
                      style={{ borderColor: color + '40', backgroundColor: color + '15' }}>
                      <span className="text-sm font-black leading-none" style={{ color }}>{day}</span>
                      <span className="text-[8px] font-bold" style={{ color }}>{mon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate leading-tight">{ev.title}</p>
                      <p className="text-[10px] font-bold uppercase truncate" style={{ color }}>
                        {ev.event_type_name || 'Event'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Event type legend */}
        {events.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Event Types</p>
            <div className="space-y-2">
              {[...new Map(events.map((ev) => [ev.event_type_name, ev.event_type_color])).entries()]
                .slice(0, 7).map(([name, color]) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color || '#6B7280' }} />
                    <span className="text-xs text-gray-600 font-medium truncate">{name}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
