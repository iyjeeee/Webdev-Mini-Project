// ============================================================
// tasks.jsx — Unified Task Board (single table, all statuses)
// Connected to: GET /api/tasks, POST /api/tasks, PATCH /api/tasks/:id
// ============================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, X, Calendar, Tag, ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import StatCard from '../../components/statCard.jsx';
import { getTasks, createTask, updateTask } from '../../api/tasksApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

// ── Style constants ───────────────────────────────────────────
const STATUS_BORDER = {
  'To Do':       'border-l-gray-400',
  'In Progress': 'border-l-blue-500',
  'Completed':   'border-l-green-500',
  'Overdue':     'border-l-red-500',
};
const STATUS_BADGE = {
  'To Do':       'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed':   'bg-green-100 text-green-700',
  'Overdue':     'bg-red-100 text-red-600',
};
const STATUS_ROW_BG = {
  'To Do':       '',
  'In Progress': 'bg-blue-50/30',
  'Completed':   'bg-green-50/30',
  'Overdue':     'bg-red-50/30',
};
const PRIORITY_COLOR = {
  'High':   'text-red-600 bg-red-50',
  'Medium': 'text-yellow-700 bg-yellow-50',
  'Low':    'text-green-700 bg-green-50',
};
const STATUS_ORDER = { 'Overdue': 0, 'In Progress': 1, 'To Do': 2, 'Completed': 3 };

// ── Task Detail Modal ─────────────────────────────────────────
const TaskDetailModal = ({ task, onClose, onUpdate }) => {
  const [updating, setUpdating] = useState(false);

  if (!task) return null;

  const handleStatusChange = async (newStatus) => {
    if (task.status === newStatus) return;
    setUpdating(true);
    try { await onUpdate(task.id, { status: newStatus }); }
    finally { setUpdating(false); }
  };

  const dueDateStr = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;
  const createdStr = task.created_at
    ? new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed';

  const statusBarColor = {
    'Completed':   'bg-green-500',
    'In Progress': 'bg-blue-500',
    'Overdue':     'bg-red-500',
    'To Do':       'bg-gray-400',
  }[task.status] || 'bg-gray-400';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colored top bar by status */}
        <div className={`h-1.5 w-full ${statusBarColor}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[task.status] || 'bg-gray-100 text-gray-600'}`}>
              {task.status}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${PRIORITY_COLOR[task.priority] || 'text-gray-500 bg-gray-50'}`}>
              {task.priority} Priority
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Title & Project */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-snug">{task.title}</h3>
            {task.project_name && (
              <p className="text-xs text-gray-400 font-bold uppercase mt-1 flex items-center gap-1">
                <Tag size={10} /> {task.project_name}
              </p>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {dueDateStr && (
              <div className={`rounded-xl p-3 border ${isOverdue ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
                  <Calendar size={10} /> Due Date
                </p>
                <p className={`text-sm font-bold ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
                  {dueDateStr}
                </p>
                {isOverdue && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">OVERDUE</span>
                )}
              </div>
            )}
            {createdStr && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Created</p>
                <p className="text-sm font-bold text-gray-800">{createdStr}</p>
              </div>
            )}
          </div>

          {/* Status change */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Change Status</p>
            <div className="flex flex-wrap gap-2">
              {['To Do', 'In Progress', 'Completed'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={task.status === s || updating}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                    ${task.status === s
                      ? (STATUS_BADGE[s] || 'bg-gray-100')
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── New Task Modal ────────────────────────────────────────────
const NewTaskModal = ({ isOpen, onClose, onCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', project_name: '', priority: 'Medium', due_date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({ title: '', description: '', project_name: '', priority: 'Medium', due_date: '' });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onChange = ({ target: { name, value } }) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSubmitting(true);
    try {
      await createTask({ ...form, status: 'To Do' });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create task.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-1.5 w-full bg-[#FBC02D]" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1 tracking-wider">Title *</label>
            <input
              name="title" value={form.title} onChange={onChange}
              placeholder="Task title..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1 tracking-wider">Description</label>
            <textarea
              name="description" value={form.description} onChange={onChange} rows={3}
              placeholder="What needs to be done?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1 tracking-wider">Project</label>
              <input
                name="project_name" value={form.project_name} onChange={onChange}
                placeholder="Project name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1 tracking-wider">Priority</label>
              <select
                name="priority" value={form.priority} onChange={onChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors cursor-pointer bg-white"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1 tracking-wider">Due Date</label>
            <input
              type="date" name="due_date" value={form.due_date} onChange={onChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors cursor-pointer"
            />
          </div>
        </div>
        <div className="px-6 pb-5 pt-2 border-t border-gray-100">
          <div className="flex rounded-lg overflow-hidden shadow-sm">
            <div className="w-2 bg-[#FBC02D] shrink-0" />
            <button
              onClick={handleSubmit} disabled={submitting}
              className="flex-1 py-2.5 bg-[#111111] text-white font-bold text-sm hover:bg-[#222222] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating…' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Sort icon ─────────────────────────────────────────────────
const SortIcon = ({ field, sortKey, sortDir }) => {
  if (sortKey !== field) return <ChevronUp size={12} className="text-gray-300" />;
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-gray-700" />
    : <ChevronDown size={12} className="text-gray-700" />;
};

// ── Main Tasks Page ───────────────────────────────────────────
const Tasks = () => {
  const { user } = useAuth();
  const [tasks,        setTasks]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey,      setSortKey]      = useState('status');
  const [sortDir,      setSortDir]      = useState('asc');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks({ pageSize: 200 });
      setTasks(res.data || []);
    } catch { /* show empty */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleUpdate = async (id, updates) => {
    await updateTask(id, updates);
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => ({ ...prev, ...updates }));
    }
  };

  const counts = useMemo(() => ({
    todo:       tasks.filter((t) => t.status === 'To Do').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    completed:  tasks.filter((t) => t.status === 'Completed').length,
    overdue:    tasks.filter((t) => t.status === 'Overdue').length,
  }), [tasks]);

  const displayed = useMemo(() => {
    let list = [...tasks];
    if (filterStatus) list = list.filter((t) => t.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.title?.toLowerCase().includes(q) ||
        t.project_name?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      let va, vb;
      if (sortKey === 'status') {
        va = STATUS_ORDER[a.status] ?? 99;
        vb = STATUS_ORDER[b.status] ?? 99;
      } else if (sortKey === 'priority') {
        const po = { High: 0, Medium: 1, Low: 2 };
        va = po[a.priority] ?? 99;
        vb = po[b.priority] ?? 99;
      } else if (sortKey === 'due_date') {
        va = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        vb = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      } else {
        va = (a[sortKey] ?? '').toString().toLowerCase();
        vb = (b[sortKey] ?? '').toString().toLowerCase();
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [tasks, filterStatus, search, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Employee';

  return (
    <div className="space-y-4 pb-10">

      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">My Task Board</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Your assigned tasks and personal to-dos — {displayName}
          </p>
        </div>
        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all cursor-pointer"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200 divide-y sm:divide-y-0">
        <StatCard value={loading ? '—' : counts.todo}       label="TO DO"       description="Not Yet Started" />
        <StatCard value={loading ? '—' : counts.inProgress} label="IN PROGRESS" description="Currently Working" />
        <StatCard value={loading ? '—' : counts.completed}  label="COMPLETED"   description="All Time" />
        <StatCard value={loading ? '—' : counts.overdue}    label="OVERDUE"     description="Past Due Date" />
      </div>

      {/* Unified Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={13} className="text-gray-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors cursor-pointer bg-white"
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <span className="text-xs text-gray-400 font-medium ml-auto whitespace-nowrap">
            {loading ? '—' : `${displayed.length} task${displayed.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  { key: 'title',        label: 'Task' },
                  { key: 'status',       label: 'Status' },
                  { key: 'priority',     label: 'Priority' },
                  { key: 'project_name', label: 'Project' },
                  { key: 'due_date',     label: 'Due Date' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-600 select-none whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <SortIcon field={key} sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded w-48 mb-1.5" />
                      <div className="h-3 bg-gray-100 rounded w-32" />
                    </td>
                    <td className="px-5 py-4"><div className="h-5 bg-gray-100 rounded-full w-20" /></td>
                    <td className="px-5 py-4"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                  </tr>
                ))
              ) : displayed.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="text-gray-300 font-semibold text-sm">No tasks found</p>
                    {(search || filterStatus) && (
                      <button
                        onClick={() => { setSearch(''); setFilterStatus(''); }}
                        className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                displayed.map((task) => {
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Completed';
                  const dueDateStr = task.due_date
                    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—';

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`border-l-4 ${STATUS_BORDER[task.status] || 'border-l-gray-300'} ${STATUS_ROW_BG[task.status] || ''} hover:bg-gray-50 cursor-pointer transition-colors group`}
                    >
                      <td className="px-5 py-4 min-w-[200px] max-w-xs">
                        <p className="font-bold text-gray-900 group-hover:text-black leading-tight line-clamp-1">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[task.status] || 'bg-gray-100 text-gray-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            task.status === 'Completed'   ? 'bg-green-500' :
                            task.status === 'In Progress' ? 'bg-blue-500'  :
                            task.status === 'Overdue'     ? 'bg-red-500'   : 'bg-gray-400'
                          }`} />
                          {task.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${PRIORITY_COLOR[task.priority] || 'text-gray-500 bg-gray-50'}`}>
                          {task.priority}
                        </span>
                      </td>

                      <td className="px-5 py-4 max-w-[160px]">
                        {task.project_name
                          ? (
                            <span className="text-xs text-gray-500 font-medium flex items-center gap-1 truncate">
                              <Tag size={10} className="shrink-0" />{task.project_name}
                            </span>
                          )
                          : <span className="text-xs text-gray-300">—</span>}
                      </td>

                      <td className={`px-5 py-4 whitespace-nowrap text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1">
                          {task.due_date && <Calendar size={11} className="shrink-0" />}
                          {dueDateStr}
                          {isOverdue && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">!</span>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        {!loading && displayed.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center gap-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Border Color:</span>
            {[
              { label: 'To Do',       color: 'bg-gray-400' },
              { label: 'In Progress', color: 'bg-blue-500' },
              { label: 'Completed',   color: 'bg-green-500' },
              { label: 'Overdue',     color: 'bg-red-500' },
            ].map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium">
                <span className={`w-2 h-4 rounded-sm ${color}`} />
                {label}
              </span>
            ))}
            <span className="ml-auto text-[10px] text-gray-400 italic hidden sm:block">Click any row to view details</span>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdate}
        />
      )}

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        onCreated={fetchTasks}
      />
    </div>
  );
};

export default Tasks;
