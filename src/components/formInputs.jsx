import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// 1. Upgraded Custom Date Picker
export const DatePickerInput = ({ label }) => {
  const [startDate, setStartDate] = useState(new Date("2026-03-02"));

  return (
    <div className="space-y-1 w-full">
      <label className="text-[10px] font-bold text-gray-400 uppercase">{label}</label>
      {/* Added w-full to this relative container */}
      <div className="relative flex items-center w-full">
        <DatePicker 
          selected={startDate} 
          onChange={(date) => setStartDate(date)} 
          dateFormat="MM/dd/yyyy"
          wrapperClassName="w-full" /* <--- THIS IS THE MAGIC FIX */
          className="w-full pl-3 pr-10 py-2 border border-gray-900 rounded-lg text-sm outline-none transition-colors focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 cursor-pointer"
        />
        <Calendar className="absolute right-3 text-gray-400 pointer-events-none" size={18} />
      </div>
    </div>
  );
};

// 2. Upgraded Custom Time Picker
export const TimePickerInput = ({ label }) => {
  const [startTime, setStartTime] = useState(new Date("2026-03-02T17:00:00"));

  return (
    <div className="space-y-1 w-full">
      <label className="text-[10px] font-bold text-gray-400 uppercase">{label}</label>
      {/* Added w-full to this relative container */}
      <div className="relative flex items-center w-full">
        <DatePicker 
          selected={startTime} 
          onChange={(date) => setStartTime(date)} 
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          wrapperClassName="w-full" /* <--- THIS IS THE MAGIC FIX */
          className="w-full pl-3 pr-10 py-2 border border-gray-900 rounded-lg text-sm outline-none transition-colors focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 cursor-pointer"
        />
        <Clock className="absolute right-3 text-gray-400 pointer-events-none" size={18} />
      </div>
    </div>
  );
};