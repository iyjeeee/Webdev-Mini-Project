import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import StatCard from '../../components/statCard';
import Pagination from '../../components/Pagination';
import AddEventTypeModal from './AddEventTypeModal';
import {
  getEventTypes, getEventTypeStats, createEventType, toggleEventType,
} from '../../api/eventTypeApi.js';

const PAGE_SIZE = 10; // rows per page

// Skeleton row — matches column count for schema v2 (5 cols)
const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-6 py-5">
        <div className="h-3 bg-gray-100 rounded w-full" />
      </td>
    ))}
  </tr>
);

const EventType = () => {
  // ── State ────────────────────────────────────────────────
  const [eventTypes,   setEventTypes]   = useState([]);
  const [stats,        setStats]        = useState({ total: 0, activeTypes: 0, eventsThisMonth: 0 });
  const [totalItems,   setTotalItems]   = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error,        setError]        = useState(null);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [currentPage,  setPage]         = useState(1);

  // ── Fetch event types list ────────────────────────────────
  const fetchEventTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEventTypes({ page: currentPage, pageSize: PAGE_SIZE });
      setEventTypes(res.data || []);
      setTotalItems(res.pagination?.total     || 0);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load event types');
    } finally { setLoading(false); }
  }, [currentPage]);

  // ── Fetch stat counts ─────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await getEventTypeStats();
      setStats(res.data);
    } catch { /* non-critical */ }
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => { fetchEventTypes(); }, [fetchEventTypes]);
  useEffect(() => { fetchStats();      }, [fetchStats]);

  // ── Handle toggle active status ───────────────────────────
  const handleToggle = async (id) => {
    try {
      await toggleEventType(id);
      fetchEventTypes(); // refresh list to reflect new is_active state
    } catch { /* silently fail — non-critical */ }
  };

  // ── Handle new event type submission ─────────────────────
  const handleAddEventType = async (formData) => {
    try {
      await createEventType({
        name:  formData.name,   // maps to event_types.name
        color: formData.color,  // maps to event_types.color (hex string)
      });
      setModalOpen(false);
      setPage(1);
      fetchEventTypes();
      fetchStats();
    } catch (err) {
      throw err; // let modal display the error
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">Event Type</h2>
          <p className="text-sm text-gray-400">Manage event categories used in the company calendar</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <Plus size={18} /> Add New Event Type
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <StatCard
          value={statsLoading ? '—' : String(stats.total)}
          label="Total Event Types"
          description="Across All Categories"
        />
        <StatCard
          value={statsLoading ? '—' : String(stats.activeTypes)}
          label="Active Types"
          description="Currently in-use"
        />
        <StatCard
          value={statsLoading ? '—' : String(stats.eventsThisMonth)}
          label="Events This Month"
          description="Using these types"
        />
      </div>

      {/* ── Event Types Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">All Event Types</h3>
          <span className="text-[11px] text-gray-400">
            {loading ? '...' : `${totalItems} type${totalItems !== 1 ? 's' : ''} total`}
          </span>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                {/* Schema v2 columns only: color, name, created_at, status, actions */}
                <th className="px-6 py-4 w-20 text-center">Color</th>
                <th className="px-6 py-4">Event Type Name</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : eventTypes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    No event types found.
                  </td>
                </tr>
              ) : (
                eventTypes.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50/50 transition-all group">

                    {/* Color swatch — stored as hex VARCHAR in DB */}
                    <td className="px-6 py-5 text-center">
                      <div
                        className="w-5 h-5 rounded-full mx-auto shadow-sm ring-1 ring-black/10"
                        style={{ backgroundColor: event.color || '#000000' }}
                      />
                    </td>

                    {/* Name — event_types.name */}
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-gray-800">{event.name}</span>
                    </td>

                    {/* Created at — formatted from event_types.created_at */}
                    <td className="px-6 py-5">
                      <span className="text-[12px] text-gray-500">
                        {event.created_at
                          ? new Date(event.created_at).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric',
                            })
                          : '—'}
                      </span>
                    </td>

                    {/* Status — event_types.is_active boolean */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${event.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                        <span className="text-[10px] font-bold border border-gray-200 px-2.5 py-1 rounded bg-white shadow-sm uppercase text-gray-600">
                          {event.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    {/* Actions — toggle is_active via PATCH */}
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleToggle(event.id)}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer"
                      >
                        {event.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — always displayed */}
        <div className="px-6 pb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>

      {/* Add New Event Type Modal */}
      <AddEventTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddEventType}
      />
    </div>
  );
};

export default EventType;
