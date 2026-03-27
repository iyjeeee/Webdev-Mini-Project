// ============================================================
// TaskDetailModal.jsx — Modal showing full task details
// ============================================================
import React from 'react';
import { X, ExternalLink, Calendar, Clock, CheckCircle2, User } from 'lucide-react';
import { STATUS_STYLES, formatDate, formatTime } from './taskData';

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  const statusStyle = STATUS_STYLES[task.status] || STATUS_STYLES['To Do'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                {task.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{task.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{task.project}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Date / Time Grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoBlock icon={<Calendar size={15} className="text-yellow-500" />} label="Date Submitted">
              {formatDate(task.dateSubmitted)}
            </InfoBlock>
            <InfoBlock icon={<CheckCircle2 size={15} className="text-green-500" />} label="Date Approved">
              {task.dateApproved ? formatDate(task.dateApproved) : <span className="text-gray-400 italic">Pending</span>}
            </InfoBlock>
            <InfoBlock icon={<Clock size={15} className="text-blue-500" />} label="Start">
              {formatDate(task.startDate)} &nbsp;·&nbsp; {formatTime(task.startTime)}
            </InfoBlock>
            <InfoBlock icon={<Clock size={15} className="text-orange-400" />} label="End">
              {formatDate(task.endDate)} &nbsp;·&nbsp; {formatTime(task.endTime)}
            </InfoBlock>
          </div>

          {/* Assigned By */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={15} className="text-gray-400 shrink-0" />
            <span>Assigned by: <span className="font-semibold text-gray-800">{task.assignedBy}</span></span>
          </div>

          {/* Task Description */}
          <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Task Description</h4>
            <div
              className="prose prose-sm max-w-none text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-100 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
              dangerouslySetInnerHTML={{ __html: task.task || '<p class="text-gray-400 italic">No description provided.</p>' }}
            />
          </div>

          {/* Project Link */}
          {task.projectLink && (
            <div>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Project / Git Link</h4>
              <a
                href={task.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors break-all"
              >
                <ExternalLink size={14} className="shrink-0" />
                {task.projectLink}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoBlock = ({ icon, label, children }) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-sm font-semibold text-gray-800">{children}</div>
  </div>
);

export default TaskDetailModal;
