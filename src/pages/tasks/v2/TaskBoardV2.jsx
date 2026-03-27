// ============================================================
// TaskBoardV2.jsx — Unified single-section layout with tile cards
// ============================================================
import React, { useState, useMemo } from 'react';
import StatCard from '../../../components/statCard';
import TaskBoardHeader from '../shared/TaskBoardHeader';
import TaskTileCard from '../shared/TaskTileCard';
import TaskDetailModal from '../shared/TaskDetailModal';
import NewTaskModal from '../shared/NewTaskModal';
import Pagination from '../shared/Pagination';
import { INITIAL_TASKS, TASK_STATUSES, STATUS_STYLES } from '../shared/taskData';

const PAGE_SIZE = 10;

const TaskBoardV2 = () => {
  const [tasks, setTasks]           = useState(INITIAL_TASKS);
  const [filterStatus, setFilter]   = useState('');
  const [selectedTask, setSelected] = useState(null);
  const [showNewTask, setShowNew]   = useState(false);
  const [currentPage, setPage]      = useState(1);

  const filtered = useMemo(() =>
    filterStatus ? tasks.filter((t) => t.status === filterStatus) : tasks,
    [tasks, filterStatus]
  );

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged       = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(() => ({
    todo:       tasks.filter((t) => t.status === TASK_STATUSES.TODO).length,
    inProgress: tasks.filter((t) => t.status === TASK_STATUSES.IN_PROGRESS).length,
    completed:  tasks.filter((t) => t.status === TASK_STATUSES.COMPLETED).length,
    overdue:    tasks.filter((t) => t.status === TASK_STATUSES.OVERDUE).length,
  }), [tasks]);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setPage(1);
  };

  const handleFilter = (val) => { setFilter(val); setPage(1); };

  return (
    <div className="space-y-4 pb-10">

      {/* Header */}
      <TaskBoardHeader
        title="My Task Board"
        subtitle="All your tasks in one unified view — John Doe"
        filterStatus={filterStatus}
        onFilterChange={handleFilter}
        onNewTask={() => setShowNew(true)}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value={String(stats.todo)}       label="TO DO"        description="Not Yet Started" />
        <StatCard value={String(stats.inProgress)} label="IN PROGRESS"  description="Currently Working" />
        <StatCard value={String(stats.completed)}  label="COMPLETED"    description="This Month" />
        <StatCard value={String(stats.overdue)}    label="OVERDUE"      description="Past Due Date" />
      </div>

      {/* Unified Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Section Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">All Tasks</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">All statuses displayed in one unified board</p>
          </div>

          {/* Status legend */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATUS_STYLES).map(([label, style]) => (
              <button
                key={label}
                onClick={() => handleFilter(filterStatus === label ? '' : label)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer
                  ${filterStatus === label
                    ? `${style.bg} ${style.text} border-transparent ring-2 ring-offset-1 ring-yellow-400`
                    : `bg-white ${style.text} border-gray-200 hover:${style.bg}`
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Tile Cards */}
        <div className="p-5">
          {paged.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-300 font-semibold text-sm">No tasks found.</p>
              <p className="text-gray-300 text-xs mt-1">Try a different filter or add a new task.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paged.map((task) => (
                <TaskTileCard key={task.id} task={task} onClick={setSelected} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelected(null)} />
      )}
      {showNewTask && (
        <NewTaskModal onClose={() => setShowNew(false)} onSubmit={handleAddTask} />
      )}
    </div>
  );
};

export default TaskBoardV2;
