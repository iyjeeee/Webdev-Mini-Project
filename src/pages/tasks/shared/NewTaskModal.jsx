// ============================================================
// NewTaskModal.jsx — Modal form to create a new task
// ============================================================
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const EMPTY_FORM = {
  title: '',
  project: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  task: '',
  projectLink: '',
};

const NewTaskModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())     e.title     = 'Title is required.';
    if (!form.project.trim())   e.project   = 'Project name is required.';
    if (!form.startDate)        e.startDate = 'Start date is required.';
    if (!form.startTime)        e.startTime = 'Start time is required.';
    if (!form.endDate)          e.endDate   = 'End date is required.';
    if (!form.endTime)          e.endTime   = 'End time is required.';
    if (!form.task || form.task === '<br>' || form.task.trim() === '')
                                e.task      = 'Task description is required.';
    if (form.startDate && form.endDate && form.startDate > form.endDate)
                                e.endDate   = 'End date must be after start date.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ 
      ...form, 
      id: Date.now(), 
      status: 'To Do', 
      dateSubmitted: new Date().toISOString().slice(0, 10), 
      dateApproved: null, 
      assignedBy: 'John Doe (Self)' 
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[93vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 flex items-center justify-center">
              <Plus size={16} className="text-black" />
            </span>
            <h2 className="text-lg font-bold text-gray-900">New Task</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">

          {/* Title - FIXED: Swapped internal double quotes for single quotes */}
          <Field 
            label="Title" 
            required 
            hint="Enter a clear, descriptive name for your task (e.g., 'Submit Q2 Budget Report')."
          >
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g., Submit Q2 Budget Report"
              className={inputCls(errors.title)}
            />
            <ErrMsg msg={errors.title} />
          </Field>

          {/* Project - FIXED: Swapped internal double quotes for single quotes */}
          <Field 
            label="Project" 
            required 
            hint="Enter the name of the project this task belongs to (e.g., 'HRIS Revamp 2026')."
          >
            <input
              type="text"
              value={form.project}
              onChange={(e) => set('project', e.target.value)}
              placeholder="e.g., HRIS Revamp 2026"
              className={inputCls(errors.project)}
            />
            <ErrMsg msg={errors.project} />
          </Field>

          {/* Start Date & Time */}
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
              Start Date &amp; Time <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-gray-400 mb-2">Select the date and time when you plan to begin this task.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 font-semibold mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set('startDate', e.target.value)}
                  className={inputCls(errors.startDate)}
                />
                <ErrMsg msg={errors.startDate} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-semibold mb-1 block">Start Time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => set('startTime', e.target.value)}
                  className={inputCls(errors.startTime)}
                />
                <ErrMsg msg={errors.startTime} />
              </div>
            </div>
          </div>

          {/* End Date & Time */}
          <div>
            <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
              End Date &amp; Time <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-gray-400 mb-2">Select the date and time when this task is expected to be completed or due.</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 font-semibold mb-1 block">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  min={form.startDate || undefined}
                  onChange={(e) => set('endDate', e.target.value)}
                  className={inputCls(errors.endDate)}
                />
                <ErrMsg msg={errors.endDate} />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-semibold mb-1 block">End Time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => set('endTime', e.target.value)}
                  className={inputCls(errors.endTime)}
                />
                <ErrMsg msg={errors.endTime} />
              </div>
            </div>
          </div>

          {/* Task Description */}
          <Field
            label="Task Description"
            required
            hint="Describe what needs to be done. You can use bold, bullets, numbered lists, and links to format your description."
          >
            <RichTextEditor
              value={form.task}
              onChange={(val) => set('task', val)}
              placeholder="Describe what needs to be done for this task..."
            />
            <ErrMsg msg={errors.task} />
          </Field>

          {/* Project / Git Link */}
          <Field
            label="Project / Git Link"
            hint="Optional: Paste a URL to the project repository, shared folder, or any relevant external resource (e.g., https://github.com/org/repo)."
          >
            <input
              type="url"
              value={form.projectLink}
              onChange={(e) => set('projectLink', e.target.value)}
              placeholder="https://github.com/company/project"
              className={inputCls(false)}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- Helpers --- */
const inputCls = (hasErr) =>
  `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${
    hasErr
      ? 'border-red-400 focus:ring-red-400 bg-red-50'
      : 'border-gray-200 focus:ring-yellow-400 focus:border-yellow-400'
  }`;

const ErrMsg = ({ msg }) =>
  msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;

const Field = ({ label, required, hint, children }) => (
  <div>
    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {hint && <p className="text-[11px] text-gray-400 mb-2">{hint}</p>}
    {children}
  </div>
);

export default NewTaskModal;