import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createLeaveRequest } from '../../api/leaveApi.js';
import ValidationModal from '../../components/ValidationModal.jsx';

// Map display name → API code for leaveTypeCode
const LEAVE_CODE = {
  'Vacation Leave':  'VL',
  'Sick Leave':      'SL',
  'Emergency Leave': 'EL',
};

// Calculate calendar days between two date strings (inclusive)
const calcDays = (a, b) => {
  if (!a || !b) return 0;
  const ms = new Date(b) - new Date(a);
  return ms < 0 ? 0 : Math.round(ms / 86400000) + 1;
};

const EMPTY = { leaveType: '', dateFrom: '', dateTo: '', reason: '', file: null };

const LeaveRequestModal = ({ isOpen, onClose, avail, onSubmitSuccess }) => {
  const [form,       setForm]       = useState(EMPTY);
  const [errors,     setErrors]     = useState({});    // inline field errors
  const [submitting, setSubmitting] = useState(false);

  // ValidationModal state — shared error/success feedback
  const [valModal, setValModal] = useState({ isOpen: false, type: 'error', title: '', messages: [] });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) { setForm(EMPTY); setErrors({}); }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const numDays = calcDays(form.dateFrom, form.dateTo); // computed day count

  const onChange = ({ target: { name, value } }) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' })); // clear field error on change
  };

  const onFile = (e) => setForm((f) => ({ ...f, file: e.target.files[0] || null }));

  // Client-side validation — returns message array for ValidationModal
  const validate = () => {
    const msgs = [];
    const e    = {};
    if (!form.leaveType) {
      e.leaveType = true;
      msgs.push('Please select a leave type.');
    }
    if (!form.dateFrom) {
      e.dateFrom = true;
      msgs.push('Start date is required.');
    }
    if (!form.dateTo) {
      e.dateTo = true;
      msgs.push('End date is required.');
    }
    if (form.dateFrom && form.dateTo && new Date(form.dateTo) < new Date(form.dateFrom)) {
      e.dateTo = true;
      msgs.push('End date must be on or after the start date.');
    }
    if (!form.reason.trim()) {
      e.reason = true;
      msgs.push('Please provide a reason for your leave.');
    }
    setErrors(e);
    return msgs;
  };

  const handleSubmit = async () => {
    const msgs = validate();
    if (msgs.length) {
      setValModal({ isOpen: true, type: 'error', title: 'Please fix the following:', messages: msgs });
      return;
    }

    setSubmitting(true);
    try {
      await createLeaveRequest({
        leaveTypeCode: LEAVE_CODE[form.leaveType],
        dateFrom:      form.dateFrom,
        dateTo:        form.dateTo,
        reason:        form.reason,
      });
      setValModal({
        isOpen:   true,
        type:     'success',
        title:    'Leave Request Submitted',
        messages: ['Your leave request has been submitted successfully and is pending approval.'],
      });
      setForm(EMPTY);
      setErrors({});
      onSubmitSuccess?.(); // trigger parent refresh
    } catch (err) {
      setValModal({
        isOpen:   true,
        type:     'error',
        title:    'Submission Failed',
        messages: [err.message || 'Failed to submit. Please try again.'],
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Field border class — red highlight when field has error
  const fieldCls = (key) =>
    `w-full text-sm border rounded-lg px-3 py-2 outline-none transition-colors cursor-pointer ${
      errors[key] ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D]'
    }`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

          {/* Brand accent top bar */}
          <div className="h-1.5 w-full bg-[#FBC02D]" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">File a Leave Request</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">

            {/* Leave type */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Leave Type <span className="text-red-400">*</span>
              </label>
              <select name="leaveType" value={form.leaveType} onChange={onChange} className={fieldCls('leaveType')}>
                <option value="">Select leave type</option>
                <option value="Vacation Leave">Vacation Leave ({avail?.vacation ?? 0} days left)</option>
                <option value="Sick Leave">Sick Leave ({avail?.sick ?? 0} days left)</option>
                <option value="Emergency Leave">Emergency Leave ({avail?.emergency ?? 0} days left)</option>
              </select>
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                  Date From <span className="text-red-400">*</span>
                </label>
                <input type="date" name="dateFrom" value={form.dateFrom} onChange={onChange} className={fieldCls('dateFrom')} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                  Date To <span className="text-red-400">*</span>
                </label>
                <input type="date" name="dateTo" value={form.dateTo} min={form.dateFrom} onChange={onChange} className={fieldCls('dateTo')} />
              </div>
            </div>

            {/* Number of days — computed read-only */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Number of Days</label>
              <input
                type="text" readOnly value={numDays > 0 ? `${numDays} day${numDays > 1 ? 's' : ''}` : ''}
                placeholder="Auto-calculated" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 outline-none"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                name="reason" value={form.reason} onChange={onChange} rows={3}
                placeholder="Briefly describe the reason for your leave…"
                className={`${fieldCls('reason')} resize-none`}
              />
            </div>

            {/* Supporting document — optional */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Supporting Document (Optional)</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer shrink-0">
                  <span className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700">
                    Choose File
                  </span>
                  <input type="file" className="hidden" onChange={onFile} />
                </label>
                <span className="text-[11px] text-gray-400 truncate">{form.file ? form.file.name : 'No file chosen'}</span>
              </div>
            </div>
          </div>

          {/* Modal Footer — Login button style */}
          <div className="px-6 pb-5 pt-2 border-t border-gray-100">
            <div className="flex rounded-lg overflow-hidden shadow-sm">
              <div className="w-2 bg-[#FBC02D] shrink-0" />
              <button
                onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2.5 bg-[#111111] text-white font-bold text-sm tracking-wide hover:bg-[#222222] active:scale-[.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit Leave Request'}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 text-center leading-relaxed">
              Leave requests are subject to approval by your immediate supervisor.
            </p>
          </div>
        </div>
      </div>

      {/* Validation / success modal — shown above the leave modal */}
      <ValidationModal
        isOpen={valModal.isOpen}
        type={valModal.type}
        title={valModal.title}
        messages={valModal.messages}
        autoClose={valModal.type === 'success'}
        onClose={() => {
          setValModal((v) => ({ ...v, isOpen: false }));
          if (valModal.type === 'success') onClose(); // close parent on success
        }}
      />
    </>
  );
};

export default LeaveRequestModal;
