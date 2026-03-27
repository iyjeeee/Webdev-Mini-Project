import React from 'react';
import { X } from 'lucide-react';
import { DatePickerInput, TimePickerInput } from '../../components/formInputs.jsx';

const OvertimeRequestModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose(); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">File New Overtime Request</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <DatePickerInput 
                label="Date of Overtime" 
                defaultValue="2026-03-02" 
              />
            </div>
            
            <TimePickerInput 
              label="Start Time" 
              defaultValue="17:00" 
            />
            
            <TimePickerInput 
              label="End Time" 
              defaultValue="19:00" 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Reason / Description</label>
            <textarea 
              rows="3" 
              placeholder="Briefly describe the reason for overtime work..." 
              className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none transition-colors focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 resize-none"
            ></textarea>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-0 mt-2">
          <button 
            onClick={handleSubmit} 
            className="w-full py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 active:scale-[.98] transition-all cursor-pointer"
          >
            Submit Request
          </button>
          <p className="text-[10px] text-gray-400 mt-3 text-center leading-relaxed px-2">
            Overtime requests must be filed within 24 hours of the rendered extra time.
          </p>
        </div>

      </div>
    </div>
  );
};

export default OvertimeRequestModal;