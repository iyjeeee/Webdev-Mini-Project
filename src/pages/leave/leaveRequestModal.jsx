import React, { useState } from 'react';
import { X } from 'lucide-react';

// Form Helpers
const toKey = (type) => ({ 'Vacation Leave': 'vacation', 'Sick Leave': 'sick', 'Emergency Leave': 'emergency' }[type] ?? null);

const calcDays = (a, b) => {
  if (!a || !b) return 0;
  const ms = new Date(b) - new Date(a);
  return ms < 0 ? 0 : Math.round(ms / 86400000) + 1;
};

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

const LeaveRequestModal = ({ isOpen, onClose, avail, onSubmitSuccess }) => {
  const [form, setForm] = useState({ leaveType: '', dateFrom: '', dateTo: '', reason: '', file: null });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null; 
  
  const numDays = calcDays(form.dateFrom, form.dateTo);

  const onChange = ({ target: { name, value } }) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
  };
  
  const onFile = (e) => setForm((f) => ({ ...f, file: e.target.files[0] || null }));

  const validate = () => {
    const e = {};
    if (!form.leaveType)  e.leaveType = 'Please select a leave type.';
    if (!form.dateFrom)   e.dateFrom  = 'Required.';
    if (!form.dateTo)     e.dateTo    = 'Required.';
    if (form.dateFrom && form.dateTo && new Date(form.dateTo) < new Date(form.dateFrom))
      e.dateTo = 'End date must be after start date.';
    if (!form.reason.trim()) e.reason = 'Please provide a reason.';
    
    const k = toKey(form.leaveType);
    if (k && numDays > avail[k])
      e.dateTo = `Only ${avail[k]} day(s) available for ${form.leaveType}.`;
    
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    setSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      const entry = {
        leaveType: form.leaveType,
        from: fmtDate(form.dateFrom),
        to: fmtDate(form.dateTo),
        days: numDays,
        reason: form.reason,
        filedOn: fmtDate(new Date().toISOString().split('T')[0]),
        status: 'Pending',
      };
      
      const key = toKey(form.leaveType);
      
      onSubmitSuccess(entry, key, numDays);
      
      // Reset and close
      setForm({ leaveType: '', dateFrom: '', dateTo: '', reason: '', file: null });
      setErrors({});
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">File a Leave Request</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Leave Type</label>
            <select name="leaveType" value={form.leaveType} onChange={onChange} className={`w-full text-sm border rounded-lg px-3 py-2 bg-white outline-none cursor-pointer transition-colors ${errors.leaveType ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400'}`}>
              <option value="">Select leave type</option>
              <option value="Vacation Leave">Vacation Leave ({avail.vacation} days left)</option>
              <option value="Sick Leave">Sick Leave ({avail.sick} days left)</option>
              <option value="Emergency Leave">Emergency Leave ({avail.emergency} days left)</option>
            </select>
            {errors.leaveType && <p className="text-[10px] text-red-500 mt-0.5">{errors.leaveType}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Date From</label>
              <input type="date" name="dateFrom" value={form.dateFrom} onChange={onChange} className={`w-full text-sm border rounded-lg px-3 py-2 outline-none cursor-pointer transition-colors ${errors.dateFrom ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400'}`} />
              {errors.dateFrom && <p className="text-[10px] text-red-500 mt-0.5">{errors.dateFrom}</p>}
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Date To</label>
              <input type="date" name="dateTo" value={form.dateTo} min={form.dateFrom} onChange={onChange} className={`w-full text-sm border rounded-lg px-3 py-2 outline-none cursor-pointer transition-colors ${errors.dateTo ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400'}`} />
              {errors.dateTo && <p className="text-[10px] text-red-500 mt-0.5">{errors.dateTo}</p>}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Number of Days</label>
            <input type="text" readOnly value={numDays > 0 ? numDays : ''} placeholder="0" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 outline-none" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Reason</label>
            <textarea name="reason" value={form.reason} onChange={onChange} rows={3} placeholder="Briefly describe the reason for your leave...." className={`w-full text-sm border rounded-lg px-3 py-2 outline-none resize-none transition-colors ${errors.reason ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-yellow-400'}`} />
            {errors.reason && <p className="text-[10px] text-red-500 mt-0.5">{errors.reason}</p>}
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Supporting Document (Optional)</label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer shrink-0">
                <span className="text-xs px-3 py-1.5 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700">Choose File</span>
                <input type="file" className="hidden" onChange={onFile} />
              </label>
              <span className="text-[11px] text-gray-400 truncate">{form.file ? form.file.name : 'No file chosen'}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-0 mt-2">
          <button 
            onClick={handleSubmit} 
            disabled={submitting} 
            className="w-full py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 active:scale-[.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Leave Request'}
          </button>
          <p className="text-[10px] text-gray-400 mt-3 text-center leading-relaxed px-2">
            Leave requests are subject to approval by your immediate supervisor.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LeaveRequestModal;