import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ValidationModal from '../../components/ValidationModal.jsx';

// Color options — hex values stored in event_types.color VARCHAR column
const COLOR_OPTIONS = [
  { hex: '#3B82F6', label: 'Blue'   },
  { hex: '#EAB308', label: 'Yellow' },
  { hex: '#22C55E', label: 'Green'  },
  { hex: '#A855F7', label: 'Purple' },
  { hex: '#EF4444', label: 'Red'    },
  { hex: '#84CC16', label: 'Lime'   },
  { hex: '#06B6D4', label: 'Cyan'   },
  { hex: '#F97316', label: 'Orange' },
  { hex: '#EC4899', label: 'Pink'   },
  { hex: '#000000', label: 'Black'  },
];

// Empty form — only fields in schema v2
const EMPTY_FORM = { name: '', color: '#3B82F6' };

const AddEventTypeModal = ({ isOpen, onClose, onSubmit }) => {
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [errors,     setErrors]     = useState({});    // inline field highlights
  const [submitting, setSubmitting] = useState(false);

  // ValidationModal state
  const [valModal, setValModal] = useState({ isOpen: false, type: 'error', title: '', messages: [] });

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) { setForm(EMPTY_FORM); setErrors({}); }
  }, [isOpen]);

  if (!isOpen) return null;

  const onChange = ({ target: { name, value } }) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: false })); // clear field error on change
  };

  // Client-side validation — returns message array for ValidationModal
  const validate = () => {
    const msgs = [];
    const e    = {};
    if (!form.name.trim()) {
      e.name = true;
      msgs.push('Event type name is required.');
    } else if (form.name.trim().length > 100) {
      e.name = true;
      msgs.push('Event type name must be 100 characters or fewer.');
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
      await onSubmit({ name: form.name.trim(), color: form.color });
      setValModal({
        isOpen:   true,
        type:     'success',
        title:    'Event Type Created',
        messages: [`"${form.name.trim()}" has been added successfully.`],
      });
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setValModal({
        isOpen:   true,
        type:     'error',
        title:    'Failed to Create',
        messages: [err.message || 'Failed to create event type. Please try again.'],
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          onClick={(e) => e.stopPropagation()} // prevent backdrop click from closing
        >
          {/* Brand accent top bar */}
          <div className="h-1.5 w-full bg-[#FBC02D]" />

          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-base tracking-tight">Add New Event Type</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Enter a name and pick a color tag</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form body */}
          <div className="p-6 space-y-5">

            {/* Event Type Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Type Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text" name="name" value={form.name} onChange={onChange}
                placeholder="e.g. Training, Holiday, Company Event"
                className={`w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors ${
                  errors.name
                    ? 'border-red-400 bg-red-50 focus:ring-red-400'
                    : 'border-gray-200 focus:border-[#FBC02D] focus:ring-[#FBC02D]'
                }`}
              />
            </div>

            {/* Color tag — swatch grid */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                Color Tag
              </label>

              <div className="flex gap-2 flex-wrap mb-3">
                {COLOR_OPTIONS.map(({ hex, label }) => (
                  <button
                    key={hex} type="button" title={label}
                    onClick={() => setForm((f) => ({ ...f, color: hex }))}
                    style={{ backgroundColor: hex }}
                    className={`w-7 h-7 rounded-full cursor-pointer transition-all border-2 ${
                      form.color === hex
                        ? 'ring-2 ring-offset-2 ring-gray-800 scale-110 border-white'
                        : 'hover:scale-110 border-transparent'
                    }`}
                    aria-label={`Select ${label}`}
                  />
                ))}
              </div>

              {/* Selected color preview */}
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <div
                  className="w-5 h-5 rounded-full shadow-sm ring-1 ring-black/10 shrink-0"
                  style={{ backgroundColor: form.color }}
                />
                <span className="text-xs font-mono text-gray-500">{form.color}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {COLOR_OPTIONS.find((c) => c.hex === form.color)?.label || 'Custom'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer — Login button style for primary, outlined for cancel */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <div className="flex-1 flex rounded-lg overflow-hidden shadow-sm">
              <div className="w-1.5 bg-[#FBC02D] shrink-0" />
              <button
                onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2.5 bg-[#111111] text-white text-sm font-bold hover:bg-[#222222] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Adding…' : 'Add Event Type'}
              </button>
            </div>
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

export default AddEventTypeModal;
