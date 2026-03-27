// ============================================================
// TaskBoardV1.jsx — 3-column Kanban layout with tile cards
// ============================================================
import React, { useState, useMemo } from 'react';
import StatCard from '../../../components/statCard';
import TaskBoardHeader from '../shared/TaskBoardHeader';
import TaskTileCard from '../shared/TaskTileCard';
import TaskDetailModal from '../shared/TaskDetailModal';
import NewTaskModal from '../shared/NewTaskModal';
import Pagination from '../shared/Pagination';
import { INITIAL_TASKS, TASK_STATUSES } from '../shared/taskData';

const PAGE_SIZE = 10;

const COLUMNS = [
  { key: TASK_STATUSES.TODO,        label: 'To Do',       accent: 'border-gray-300' },
  { key: TASK_STATUSES.IN_PROGRESS, label: 'In Progress', accent: 'border-blue-400' },
  { key: TASK_STATUSES.COMPLETED,   label: 'Completed',   accent: 'border-green-400' },
];

const TaskBoardV1 = () => {
  const [tasks, setTasks]           = useState(INITIAL_TASKS);
  const [filterStatus, setFilter]   = useState('');
  const [selectedTask, setSelected] = useState(null);
  const [showNewTask, setShowNew]   = useState(false);
  // Per-column current page
  const [pages, setPages]           = useState({ 'To Do': 1, 'In Progress': 1, 'Completed': 1 });

  const filtered = useMemo(() =>
    filterStatus ? tasks.filter((t) => t.status === filterStatus) : tasks,
    [tasks, filterStatus]
  );

  const stats = useMemo(() => ({
    todo:       tasks.filter((t) => t.status === TASK_STATUSES.TODO).length,
    inProgress: tasks.filter((t) => t.status === TASK_STATUSES.IN_PROGRESS).length,
    completed:  tasks.filter((t) => t.status === TASK_STATUSES.COMPLETED).length,
    overdue:    tasks.filter((t) => t.status === TASK_STATUSES.OVERDUE).length,
  }), [tasks]);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setPages((prev) => ({ ...prev, 'To Do': 1 }));
  };

  const setColPage = (col, page) => setPages((prev) => ({ ...prev, [col]: page }));

  return (
    <div className="space-y-4 pb-10">

      {/* Header */}
      <TaskBoardHeader
        title="My Task Board"
        subtitle="Your assigned tasks and personal to-dos — John Doe"
        filterStatus={filterStatus}
        onFilterChange={(v) => { setFilter(v); setPages({ 'To Do': 1, 'In Progress': 1, 'Completed': 1 }); }}
        onNewTask={() => setShowNew(true)}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard value={String(stats.todo)}       label="TO DO"        description="Not Yet Started" />
        <StatCard value={String(stats.inProgress)} label="IN PROGRESS"  description="Currently Working" />
        <StatCard value={String(stats.completed)}  label="COMPLETED"    description="This Month" />
        <StatCard value={String(stats.overdue)}    label="OVERDUE"      description="Past Due Date" />
      </div>

      {/* 3-Column Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {COLUMNS.map(({ key, label, accent }) => {
          const colTasks = filtered.filter((t) => t.status === key);
          const total    = colTasks.length;
          const curPage  = pages[key] || 1;
          const totalPgs = Math.ceil(total / PAGE_SIZE) || 1;
          const paged    = colTasks.slice((curPage - 1) * PAGE_SIZE, curPage * PAGE_SIZE);

          return (
            <div key={key} className={`bg-white rounded-xl border-t-4 ${accent} border border-gray-200 shadow-sm flex flex-col`}>
              {/* Column Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between rounded-t-xl">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">{label}</h3>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{total}</span>
              </div>

              {/* Cards */}
              <div className="p-4 flex-1">
                {paged.length === 0 ? (
                  <EmptyCol label={label} />
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {paged.map((task) => (
                      <TaskTileCard key={task.id} task={task} onClick={setSelected} />
                    ))}
                  </div>
                )}

                {/* Per-column pagination */}
                <Pagination
                  currentPage={curPage}
                  totalPages={totalPgs}
                  onPageChange={(p) => setColPage(key, p)}
                  totalItems={total}
                  pageSize={PAGE_SIZE}
                />
              </div>
            </div>
          );
        })}
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

const EmptyCol = ({ label }) => (
  <div className="py-10 text-center">
    <p className="text-sm text-gray-300 font-semibold">No {label} tasks</p>
  </div>
);

export default TaskBoardV1;
