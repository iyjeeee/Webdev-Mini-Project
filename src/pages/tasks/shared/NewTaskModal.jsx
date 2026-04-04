import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ValidationModal from '../../../components/ValidationModal.jsx';

const EMPTY_FORM = {
  title:       '',
  project:     '',
  startDate:   '',
  startTime:   '',
  endDate:     '',
  endTime:     '',
  task:        '',
  projectLink: '',
};

const NewTaskModal = ({ onClose, onSubmit }) => {
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // ValidationModal state
  const [valModal, setValModal] = useState({ isOpen: false, type: 'error', title: '', messages: [] });

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false })); // clear field error on edit
  };

  // Client-side validation — returns message array for ValidationModal
  const validate = () => {
    const msgs = [];
    const e    = {};
    if (!form.title.trim()) {
      e.title = true;
      msgs.push('Task title is required.');
    }
    if (!form.project.trim()) {
      e.project = true;
      msgs.push('Project name is required.');
    }
    if (!form.startDate) {
      e.startDate = true;
      msgs.push('Start date is required.');
    }
    if (!form.startTime) {
      e.startTime = true;
      msgs.push('Start time is required.');
    }
    if (!form.endDate) {
      e.endDate = true;
      msgs.push('End date is required.');
    }
    if (!form.endTime) {
      e.endTime = true;
      msgs.push('End time is required.');
    }
    if (!form.task || form.task === '<br>' || form.task.trim() === '') {
      e.task = true;
      msgs.push('Task description is required.');
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      e.endDate = true;
      msgs.push('End date must be on or after start date.');
    }
    setErrors(e);
    return msgs;
  };

  const handleSubmit = () => {
    const msgs = validate();
    if (msgs.length) {
      setValModal({ isOpen: true, type: 'error', title: 'Please fix the following:', messages: msgs });
      return;
    }
    onSubmit({
      ...form,
      id:            Date.now(),
      status:        'To Do',
      dateSubmitted: new Date().toISOString().slice(0, 10),
      dateApproved:  null,
      assignedBy:    'Self',
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[93vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()} // prevent backdrop close on inner click
        >
          {/* Brand accent top bar */}
          <div className="h-1.5 w-full bg-[#FBC02D] shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
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

          {/* Scrollable form body */}
          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

            {/* Title */}
            <Field
              label="Title"
              required
              hint="Enter a clear, descriptive name for your task."
            >
              <input
                type="text" value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Submit Q2 Budget Report"
                className={inputCls(errors.title)}
              />
            </Field>

            {/* Project */}
            <Field
              label="Project"
              required
              hint="Enter the name of the project this task belongs to."
            >
              <input
                type="text" value={form.project}
                onChange={(e) => set('project', e.target.value)}
                placeholder="e.g. HRIS Revamp 2026"
                className={inputCls(errors.project)}
              />
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
                  <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls(errors.startDate)} />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold mb-1 block">Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => set('startTime', e.target.value)} className={inputCls(errors.startTime)} />
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
                  <input type="date" value={form.endDate} min={form.startDate || undefined} onChange={(e) => set('endDate', e.target.value)} className={inputCls(errors.endDate)} />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-semibold mb-1 block">End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} className={inputCls(errors.endTime)} />
                </div>
              </div>
            </div>

            {/* Task Description */}
            <Field
              label="Task Description"
              required
              hint="Describe what needs to be done. You can use bold, bullets, numbered lists, and links."
            >
              <div className={errors.task ? 'ring-1 ring-red-400 rounded-lg' : ''}>
                <RichTextEditor
                  value={form.task}
                  onChange={(val) => set('task', val)}
                  placeholder="Describe what needs to be done for this task…"
                />
              </div>
            </Field>

            {/* Project / Git Link — optional */}
            <Field
              label="Project / Git Link"
              hint="Optional: Paste a URL to the project repository, shared folder, or any relevant resource."
            >
              <input
                type="url" value={form.projectLink}
                onChange={(e) => set('projectLink', e.target.value)}
                placeholder="https://github.com/company/project"
                className={inputCls(false)}
              />
            </Field>
          </div>

          {/* Footer — Login button style */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {/* Create Task button — brand style */}
            <div className="flex rounded-lg overflow-hidden shadow-sm">
              <div className="w-2 bg-[#FBC02D] shrink-0" />
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#111111] text-white font-bold text-sm tracking-wide hover:bg-[#222222] active:scale-[.99] transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus size={15} /> Create Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Validation modal — shown above task modal */}
      <ValidationModal
        isOpen={valModal.isOpen}
        type={valModal.type}
        title={valModal.title}
        messages={valModal.messages}
        onClose={() => setValModal((v) => ({ ...v, isOpen: false }))}
      />
    </>
  );
};

/* ── Helpers ─────────────────────────────────────────────── */

// Input field class — red border + bg when field has error
const inputCls = (hasErr) =>
  `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-1 ${
    hasErr
      ? 'border-red-400 focus:ring-red-400 bg-red-50'
      : 'border-gray-200 focus:ring-[#FBC02D] focus:border-[#FBC02D]'
  }`;

// Field wrapper with label + optional hint
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
