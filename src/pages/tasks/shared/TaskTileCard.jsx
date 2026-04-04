import React from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { STATUS_STYLES, formatDate, formatTime } from './taskData';

// Status-to-hover-border mapping for clear visual distinction on hover
const STATUS_HOVER_BORDER = {
  'To Do':       'hover:border-gray-400',
  'In Progress': 'hover:border-blue-400',
  'Completed':   'hover:border-green-400',
  'Overdue':     'hover:border-red-400',
};

const TaskTileCard = ({ task, onClick }) => {
  const style       = STATUS_STYLES[task.status] || STATUS_STYLES['To Do'];
  const hoverBorder = STATUS_HOVER_BORDER[task.status] || 'hover:border-yellow-300'; // fallback

  return (
    <div
      onClick={() => onClick(task)}
      className={[
        'bg-white border border-gray-200 rounded-xl p-4 shadow-sm',
        'hover:shadow-md transition-all cursor-pointer group space-y-3',
        hoverBorder,
      ].join(' ')}
    >
      {/* Status Badge + view hint */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${style.bg} ${style.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
          {task.status}
        </span>
        <span className="text-[10px] text-gray-400 font-medium group-hover:text-gray-600 transition-colors">
          View details →
        </span>
      </div>

      {/* Title and project */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-yellow-600 transition-colors line-clamp-2">
          {task.title}
        </h4>
        <p className="text-[11px] text-gray-500 mt-0.5 font-medium truncate">{task.project}</p>
      </div>

      {/* Date and time metadata */}
      <div className="space-y-1.5 border-t border-gray-100 pt-3">
        <InfoRow icon={<Calendar size={11} className="text-gray-400 shrink-0" />} label="Submitted">
          {formatDate(task.dateSubmitted)}
        </InfoRow>
        <InfoRow icon={<Clock size={11} className="text-blue-400 shrink-0" />} label="Start">
          {formatDate(task.startDate)} · {formatTime(task.startTime)}
        </InfoRow>
        <InfoRow icon={<Clock size={11} className="text-orange-400 shrink-0" />} label="End">
          {formatDate(task.endDate)} · {formatTime(task.endTime)}
        </InfoRow>
        <InfoRow icon={<CheckCircle2 size={11} className="text-green-500 shrink-0" />} label="Approved">
          {task.dateApproved
            ? <span className="text-green-700 font-semibold">{formatDate(task.dateApproved)}</span>
            : <span className="text-gray-400 italic">Pending</span>}
        </InfoRow>
      </div>
    </div>
  );
};

// Shared info row helper for date/time display
const InfoRow = ({ icon, label, children }) => (
  <div className="flex items-center gap-1.5">
    {icon}
    <span className="text-[10px] text-gray-400 w-14 shrink-0">{label}</span>
    <span className="text-[11px] text-gray-700 font-medium">{children}</span>
  </div>
);

export default TaskTileCard;
