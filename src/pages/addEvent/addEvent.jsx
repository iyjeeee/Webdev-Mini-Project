import React, { useState } from 'react';
import { Calendar, Clock, Paperclip } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// ── Inline lightweight wrappers so formInputs stay reusable ──────────────────
const DateInput = ({ label, required, value, onChange }) => (
  <div className="space-y-1 w-full">
    {label && (
      <label className="block text-xs font-semibold text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative flex items-center w-full">
      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat="MM/dd/yyyy"
        wrapperClassName="w-full"
        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 cursor-pointer"
      />
      <Calendar className="absolute right-3 text-gray-400 pointer-events-none" size={16} />
    </div>
  </div>
);

const TimeInput = ({ label, value, onChange }) => (
  <div className="space-y-1 w-full">
    {label && <label className="block text-xs font-semibold text-gray-600">{label}</label>}
    <div className="relative flex items-center w-full">
      <DatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        wrapperClassName="w-full"
        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 cursor-pointer"
      />
      <Clock className="absolute right-3 text-gray-400 pointer-events-none" size={16} />
    </div>
  </div>
);

// ── Recently created (mock data) ─────────────────────────────────────────────
const RECENT_EVENTS = [
  { title: 'Company Teambuilding', date: 'Mar 15, 2026', type: 'Company Event', visibility: 'All Employees' },
  { title: 'Payroll Cut-off March', date: 'Mar 26, 2026', type: 'Payroll',       visibility: 'All Employees' },
  { title: 'Q1 Performance Review', date: 'Mar 31, 2026', type: 'HR Event',      visibility: 'All Employees' },
];

const EVENT_TYPES = [
  'Holiday', 'Company Event', 'Payroll', 'Training',
  'Deadline', 'HR Event', 'Department Meetings',
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (date) => date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Set';
const fmtTime = (date) => date ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

// ── Component ────────────────────────────────────────────────────────────────
const AddEvent = () => {
  const [form, setForm] = useState({
    title:      '',
    eventType:  '',
    visibility: 'All Employees',
    startDate:  new Date('2026-03-10'),
    endDate:    new Date('2026-03-10'),
    startTime:  new Date('2026-03-10T08:00:00'),
    endTime:    new Date('2026-03-10T12:00:00'),
    allDay:     false,
    location:   '',
    description:'',
    attachment: null,
  });

  const [errors, setErrors]   = useState({});
  const [recentEvents, setRecentEvents] = useState(RECENT_EVENTS);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())     e.title     = 'Event title is required.';
    if (!form.eventType)        e.eventType = 'Please select an event type.';
    if (!form.startDate)        e.startDate = 'Start date is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newEvent = {
      title:      form.title,
      date:       fmt(form.startDate),
      type:       form.eventType,
      visibility: form.visibility,
    };
    setRecentEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    // Reset
    setForm({
      title: '', eventType: '', visibility: 'All Employees',
      startDate: new Date('2026-03-10'), endDate: new Date('2026-03-10'),
      startTime: new Date('2026-03-10T08:00:00'), endTime: new Date('2026-03-10T12:00:00'),
      allDay: false, location: '', description: '', attachment: null,
    });
    setErrors({});
  };

  const handleCancel = () => {
    setForm({
      title: '', eventType: '', visibility: 'All Employees',
      startDate: new Date('2026-03-10'), endDate: new Date('2026-03-10'),
      startTime: new Date('2026-03-10T08:00:00'), endTime: new Date('2026-03-10T12:00:00'),
      allDay: false, location: '', description: '', attachment: null,
    });
    setErrors({});
  };

  // ── Preview values ────────────────────────────────────────────────────────
  const previewTime = form.allDay
    ? 'All Day'
    : `${fmtTime(form.startTime)} - ${fmtTime(form.endTime)}`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Create Event</h2>
        <p className="text-sm text-gray-400">Add a new event to the company calendar - visible to all employees</p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Left: Form ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-3">Event Details</h3>

          {/* Event Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Enter event title..."
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 ${errors.title ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.title && <p className="text-[10px] text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Event Type + Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.eventType}
                onChange={e => set('eventType', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 bg-white ${errors.eventType ? 'border-red-400' : 'border-gray-300'}`}
              >
                <option value="">Select event type</option>
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              {errors.eventType && <p className="text-[10px] text-red-500 mt-1">{errors.eventType}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Visibility</label>
              <select
                value={form.visibility}
                onChange={e => set('visibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 bg-white"
              >
                <option>All Employees</option>
                <option>Specific Departments</option>
                <option>Management Only</option>
              </select>
            </div>
          </div>

          {/* Start Date + End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DateInput
                label="Start Date"
                required
                value={form.startDate}
                onChange={d => set('startDate', d)}
              />
              {errors.startDate && <p className="text-[10px] text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <DateInput
              label="End Date"
              value={form.endDate}
              onChange={d => set('endDate', d)}
            />
          </div>

          {/* Start Time + End Time */}
          {!form.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <TimeInput label="Start Time" value={form.startTime} onChange={d => set('startTime', d)} />
              <TimeInput label="End Time"   value={form.endTime}   onChange={d => set('endTime', d)} />
            </div>
          )}

          {/* All Day Event */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.allDay}
              onChange={e => set('allDay', e.target.checked)}
              className="w-4 h-4 accent-yellow-400 cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">All Day Event</span>
          </label>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Location / Venue</label>
            <input
              type="text"
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="e.g. Conference Room, Online (Zoom), Venue / BA"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the event, agenda, instructions, or notes for employees..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
            />
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Attachment (Optional)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                <Paperclip size={13} />
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={e => set('attachment', e.target.files[0] || null)}
                />
              </label>
              <span className="text-xs text-gray-400">
                {form.attachment ? form.attachment.name : 'No file chosen'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-black text-white text-sm font-bold py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Event
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ── Right: Preview + Recent ─────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Event Preview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Event Preview</h3>
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              {form.title.trim() || '(No Title)'}
            </h4>
            <div className="space-y-2 divide-y divide-gray-100">
              {[
                { key: 'Type',       val: form.eventType  || 'Not Set' },
                { key: 'Date',       val: fmt(form.startDate) },
                { key: 'Time',       val: previewTime },
                { key: 'Location',   val: form.location.trim()  || 'Not Specified' },
                { key: 'Visibility', val: form.visibility },
                { key: 'Created by', val: 'John Doe' },
              ].map(({ key, val }) => (
                <div key={key} className="flex justify-between items-start pt-2 first:pt-0">
                  <span className="text-[11px] text-gray-400 font-medium w-24 shrink-0">{key}</span>
                  <span className="text-[12px] text-gray-800 font-semibold text-right leading-snug">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Created */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recently Created Event</h3>
            <div className="space-y-3">
              {recentEvents.map((ev, i) => (
                <div key={i} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <p className="text-[13px] font-bold text-gray-800 leading-tight">{ev.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {ev.date} · {ev.type} · {ev.visibility}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddEvent;