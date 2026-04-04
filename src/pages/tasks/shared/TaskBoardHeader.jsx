import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { TASK_STATUSES } from './taskData';

// Filter options aligned with TASK_STATUSES constants
const FILTER_OPTIONS = [
  { value: '',                           label: 'All' },
  { value: TASK_STATUSES.TODO,           label: 'To Do' },
  { value: TASK_STATUSES.IN_PROGRESS,    label: 'In Progress' },
  { value: TASK_STATUSES.COMPLETED,      label: 'Completed' },
  { value: TASK_STATUSES.OVERDUE,        label: 'Overdue' },
];

const TaskBoardHeader = ({ title, subtitle, filterStatus, onFilterChange, onNewTask }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    {/* Page title and subtitle */}
    <div>
      <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
      <p className="text-sm text-gray-400 font-medium mt-0.5">{subtitle}</p>
    </div>

    {/* Controls: filter dropdown + new task button */}
    <div className="flex items-center gap-3 shrink-0">
      {/* Status filter dropdown */}
      <div className="relative">
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-9 text-sm font-medium outline-none focus:ring-1 focus:ring-yellow-400 cursor-pointer"
        >
          {FILTER_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
      </div>

      {/* New task button */}
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
