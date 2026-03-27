// ============================================================
// TaskBoardHeader.jsx — Header bar with filter + New Task btn
// ============================================================
import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { TASK_STATUSES } from './taskData';

const TaskBoardHeader = ({ title, subtitle, filterStatus, onFilterChange, onNewTask }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
      <p className="text-sm text-gray-400 font-medium mt-0.5">{subtitle}</p>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      {/* Filter Dropdown */}
      <div className="relative">
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-9 text-sm font-medium outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer"
        >
          <option value="">All Tasks</option>
          {Object.values(TASK_STATUSES).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
      </div>

      {/* New Task Button */}
      <button
        onClick={onNewTask}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all cursor-pointer whitespace-nowrap"
      >
        <Plus size={17} /> New Task
      </button>
    </div>
  </div>
);

export default TaskBoardHeader;
