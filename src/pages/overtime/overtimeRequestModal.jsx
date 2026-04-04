import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createOvertimeRequest } from '../../api/overtimeApi.js';
import ValidationModal from '../../components/ValidationModal.jsx';

const EMPTY = { otDate: '', otStart: '17:00', otEnd: '19:00', reason: '' };

const OvertimeRequestModal = ({ isOpen, onClose, onSuccess }) => {
  const [form,       setForm]       = useState(EMPTY);
  const [errors,     setErrors]     = useState({});    // inline field highlights
  const [submitting, setSubmitting] = useState(false);

  // ValidationModal state
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

  // Field change — clears field error on edit
  const onChange = ({ target: { name, value } }) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: false }));
  };

  // Client-side validation — returns message array for ValidationModal
  const validate = () => {
    const msgs = [];
    const e    = {};
    if (!form.otDate) {
      e.otDate = true;
      msgs.push('Date of overtime is required.');
    }
    if (!form.otStart) {
      e.otStart = true;
      msgs.push('Start time is required.');
    }
    if (!form.otEnd) {
      e.otEnd = true;
      msgs.push('End time is required.');
    }
    if (form.otStart && form.otEnd && form.otEnd <= form.otStart) {
      e.otEnd = true;
      msgs.push('End time must be after start time.');
    }
    setErrors(e);
    return msgs;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const msgs = validate();
    if (msgs.length) {
      setValModal({ isOpen: true, type: 'error', title: 'Please fix the following:', messages: msgs });
      return;
    }

    setSubmitting(true);
    try {
      await createOvertimeRequest({
        otDate:  form.otDate,
        otStart: form.otStart,
        otEnd:   form.otEnd,
        reason:  form.reason,
      });
      setValModal({
        isOpen:   true,
        type:     'success',
        title:    'Overtime Request Submitted',
        messages: ['Your overtime request has been submitted successfully and is pending approval.'],
      });
      setForm(EMPTY);
      setErrors({});
      onSuccess?.(); // tell parent to refresh list
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

  // Field border class helper — red highlight on error
  const fieldCls = (key) =>
    `w-full p-2.5 border rounded-lg text-sm outline-none transition-colors focus:ring-1 cursor-pointer ${
      errors[key]
        ? 'border-red-400 bg-red-50 focus:ring-red-400'
        : 'border-gray-200 focus:border-[#FBC02D] focus:ring-[#FBC02D]'
    }`;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

          {/* Brand accent top bar */}
          <div className="h-1.5 w-full bg-[#FBC02D]" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">File New Overtime Request</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">

              {/* Date of Overtime — full width */}
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                  Date of Overtime <span className="text-red-400">*</span>
                </label>
                <input
                  type="date" name="otDate" value={form.otDate} onChange={onChange}
                  className={fieldCls('otDate')}
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                  Start Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="time" name="otStart" value={form.otStart} onChange={onChange}
                  className={fieldCls('otStart')}
                />
              </div>

              {/* End Time */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                  End Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="time" name="otEnd" value={form.otEnd} onChange={onChange}
                  className={fieldCls('otEnd')}
                />
              </div>
            </div>

            {/* Reason — optional */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reason / Description</label>
              <textarea
                name="reason" value={form.reason} onChange={onChange}
                rows={3} placeholder="Briefly describe the reason for overtime work…"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none transition-colors focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] resize-none"
              />
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
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 text-center leading-relaxed">
              Overtime requests must be filed within 24 hours of the rendered extra time.
            </p>
          </div>
        </div>
      </div>

      {/* Validation / success modal */}
      <ValidationModal
        isOpen={valModal.isOpen}
        type={valModal.type}
        title={valModal.title}
        messages={valModal.messages}
        autoClose={valModal.type === 'success'}
        onClose={() => {
          setValModal((v) => ({ ...v, isOpen: false }));
          if (valModal.type === 'success') onClose();
        }}
      />
    </>
  );
};

export default OvertimeRequestModal;
