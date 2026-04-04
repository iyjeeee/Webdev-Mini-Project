import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Paperclip } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../api/apiClient.js';           // shared HTTP client
import { getCalendarEvents } from '../../api/calendarApi.js'; // for recent events
import ValidationModal from '../../components/ValidationModal.jsx'; // shared error/success modal

// ── Lightweight date/time picker wrappers ────────────────────
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
        className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 cursor-pointer"
      />
      <Calendar className="absolute right-3 text-gray-300 pointer-events-none" size={15} />
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
        showTimeSelect showTimeSelectOnly
        timeIntervals={15} timeCaption="Time"
        dateFormat="h:mm aa"
        wrapperClassName="w-full"
        className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 cursor-pointer"
      />
      <Clock className="absolute right-3 text-gray-300 pointer-events-none" size={15} />
    </div>
  </div>
);

// ── Helpers ──────────────────────────────────────────────────
const fmt     = (d) => d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not Set';
const fmtTime = (d) => d ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
const toISODate = (d) => d ? d.toISOString().split('T')[0] : null;          // YYYY-MM-DD for DB date columns
const toTimeStr = (d) => d ? d.toTimeString().slice(0, 5) : null;           // HH:MM for DB time columns

// Default blank form matching calendar_events schema v2 columns
const defaultForm = () => ({
  title:       '',
  eventTypeId: '',   // FK to event_types.id
  startDate:   new Date(),
  endDate:     new Date(),
  startTime:   new Date(new Date().setHours(8, 0, 0, 0)),
  endTime:     new Date(new Date().setHours(12, 0, 0, 0)),
  allDay:      false,
  location:    '',
  description: '',
  attachment:  null,
});

const AddEvent = () => {
  const [form,         setForm]         = useState(defaultForm());
  const [errors,       setErrors]       = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [eventTypes,   setEventTypes]   = useState([]);
  // ValidationModal state — replaces inline error/success banners
  const [valModal, setValModal] = useState({ isOpen: false, type: 'error', title: '', messages: [] }); // error/success feedback modal
  const [recentEvents, setRecentEvents] = useState([]);  // fetched from /api/calendar

  // Load event types for dropdown (from event_types table)
  const loadEventTypes = useCallback(async () => {
    try {
      const res = await api.get('/event-types', { pageSize: 50 }); // get all active types
      setEventTypes((res.data || []).filter((t) => t.is_active));
    } catch { /* non-critical — keep empty dropdown */ }
  }, []);

  // Load 5 most recent calendar events for sidebar
  const loadRecentEvents = useCallback(async () => {
    try {
      const res = await getCalendarEvents({ pageSize: 5, sort: 'desc' });
      setRecentEvents(res.data || []);
    } catch { /* non-critical */ }
  }, []);

  useEffect(() => {
    loadEventTypes();
    loadRecentEvents();
  }, [loadEventTypes, loadRecentEvents]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Client-side validation — returns message array for ValidationModal
  const validate = () => {
    const msgs = [];
    const e    = {};
    if (!form.title.trim()) {
      e.title = true;
      msgs.push('Event title is required.');
    }
    if (!form.eventTypeId) {
      e.eventTypeId = true;
      msgs.push('Please select an event type.');
    }
    if (!form.startDate) {
      e.startDate = true;
      msgs.push('Start date is required.');
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      e.endDate = true;
      msgs.push('End date must be on or after the start date.');
    }
    if (!form.allDay && form.startTime && form.endTime && form.endTime <= form.startTime) {
      e.endTime = true;
      msgs.push('End time must be after start time.');
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
      // Build payload matching calendar_events schema v2 columns exactly
      await api.post('/calendar', {
        title:         form.title.trim(),
        event_type_id: Number(form.eventTypeId),   // FK integer
        start_date:    toISODate(form.startDate),  // DATE column
        end_date:      toISODate(form.endDate),    // DATE column (nullable)
        start_time:    form.allDay ? null : toTimeStr(form.startTime), // TIME nullable
        end_time:      form.allDay ? null : toTimeStr(form.endTime),   // TIME nullable
        is_all_day:    form.allDay,                // BOOLEAN
        location:      form.location.trim() || null,
        description:   form.description.trim() || null,
      });
      setValModal({
        isOpen:   true,
        type:     'success',
        title:    'Event Created',
        messages: [`"${form.title.trim()}" has been added to the company calendar.`],
      });
      setForm(defaultForm());
      setErrors({});
      loadRecentEvents(); // refresh the recently created panel
    } catch (err) {
      setValModal({
        isOpen:   true,
        type:     'error',
        title:    'Failed to Create Event',
        messages: [err.message || 'Failed to create event. Please try again.'],
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(defaultForm());
    setErrors({});
    setValModal((v) => ({ ...v, isOpen: false })); // close any open modal
  };

  // Preview values for the right sidebar
  const previewTime = form.allDay
    ? 'All Day'
    : `${fmtTime(form.startTime)} — ${fmtTime(form.endTime)}`;

  // Find selected event type name for preview
  const selectedTypeName = eventTypes.find((t) => String(t.id) === String(form.eventTypeId))?.name || 'Not Set';

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">Create Event</h2>
        <p className="text-sm text-gray-400">Add a new event to the company calendar — visible to all employees</p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Left: Event form ──────────────────────────────────── */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-3">Event Details</h3>

          {/* Event Title — maps to calendar_events.title */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text" value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Enter event title..."
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 ${
                errors.title ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.title && <p className="text-[10px] text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Event Type — FK to event_types.id (no visibility in schema v2) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.eventTypeId}
              onChange={(e) => set('eventTypeId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 bg-white ${
                errors.eventTypeId ? 'border-red-400' : 'border-gray-200'
              }`}
            >
              <option value="">Select event type</option>
              {eventTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {errors.eventTypeId && <p className="text-[10px] text-red-500 mt-1">{errors.eventTypeId}</p>}
          </div>

          {/* Start Date + End Date — maps to calendar_events.start_date / end_date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DateInput label="Start Date" required value={form.startDate} onChange={(d) => set('startDate', d)} />
              {errors.startDate && <p className="text-[10px] text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <DateInput label="End Date" value={form.endDate} onChange={(d) => set('endDate', d)} />
          </div>

          {/* Start Time + End Time — hidden when all-day; maps to start_time / end_time TIME columns */}
          {!form.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <TimeInput label="Start Time" value={form.startTime} onChange={(d) => set('startTime', d)} />
              <TimeInput label="End Time"   value={form.endTime}   onChange={(d) => set('endTime', d)} />
            </div>
          )}

          {/* All Day toggle — maps to calendar_events.is_all_day BOOLEAN */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox" checked={form.allDay}
              onChange={(e) => set('allDay', e.target.checked)}
              className="w-4 h-4 accent-yellow-400 cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">All Day Event</span>
          </label>

          {/* Location — maps to calendar_events.location VARCHAR(250) */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Location / Venue</label>
            <input
              type="text" value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Conference Room, Online (Zoom), Venue / BA"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400"
            />
          </div>

          {/* Description — maps to calendar_events.description TEXT */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea
              rows={4} value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the event, agenda, instructions, or notes for employees..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
            />
          </div>

          {/* Attachment — UI only, schema v2 has no attachment storage column */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Attachment <span className="text-gray-400 font-normal">(Optional — UI only)</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-xs font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                <Paperclip size={13} />
                Choose File
                <input type="file" className="hidden" onChange={(e) => set('attachment', e.target.files[0] || null)} />
              </label>
              <span className="text-xs text-gray-400">
                {form.attachment ? form.attachment.name : 'No file chosen'}
              </span>
            </div>
          </div>

          {/* Form action buttons */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            {/* Create button — Login button style */}
            <div className="flex-1 flex rounded-lg overflow-hidden shadow-sm">
              <div className="w-2 bg-[#FBC02D] shrink-0" />
              <button
                type="button" onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-2.5 bg-[#111111] text-white font-bold text-sm tracking-wide hover:bg-[#222222] active:scale-[.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating…' : 'Create Event'}
              </button>
            </div>
            <button
              type="button" onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* ── Right: Preview + Recently Created ─────────────────── */}
        <div className="lg:col-span-4 space-y-4">

          {/* Event Preview card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Event Preview</h3>
            <h4 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
              {form.title.trim() || '(No Title)'}
            </h4>
            <div className="space-y-2 divide-y divide-gray-100">
              {[
                { key: 'Type',       val: selectedTypeName },
                { key: 'Start Date', val: fmt(form.startDate) },
                { key: 'End Date',   val: fmt(form.endDate) },
                { key: 'Time',       val: previewTime },
                { key: 'Location',   val: form.location.trim() || 'Not Specified' },
              ].map(({ key, val }) => (
                <div key={key} className="flex justify-between items-start pt-2 first:pt-0">
                  <span className="text-[11px] text-gray-400 font-medium w-24 shrink-0">{key}</span>
                  <span className="text-[12px] text-gray-800 font-semibold text-right leading-snug">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Created Events — fetched from DB */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Recently Created
            </h3>
            {recentEvents.length === 0 ? (
              <p className="text-xs text-gray-400">No recent events.</p>
            ) : (
              <div className="space-y-3">
                {recentEvents.map((ev) => (
                  <div key={ev.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <p className="text-[13px] font-bold text-gray-800 leading-tight">{ev.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {ev.start_date} · {ev.event_type_name || ev.event_type}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
        onClose={() => setValModal((v) => ({ ...v, isOpen: false }))}
      />
    </div>
  );
};

export default AddEvent;
