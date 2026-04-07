import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Fingerprint, ClipboardList,
  Clock, FileText, FileBarChart, Calendar, Tags,
  CalendarPlus, User, LogOut, Bell, X, ChevronLeft, ChevronRight, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getNotifications, markAllAsRead } from '../api/notificationApi.js';

// Notification type badge colours
const TYPE_BADGE = {
  leave:    'bg-blue-100 text-blue-600',
  overtime: 'bg-orange-100 text-orange-600',
  task:     'bg-purple-100 text-purple-600',
  system:   'bg-gray-100 text-gray-600',
  calendar: 'bg-cyan-100 text-cyan-600',
};

const NOTIF_PAGE_SIZE = 5; // notifications per page in modal

// ── Notification Item ─────────────────────────────────────────
const NotificationItem = ({ title, body, type, createdAt, isRead }) => {
  // Format relative time from ISO timestamp
  const relTime = (iso) => {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60)  return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24)  return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group last:border-b-0 ${!isRead ? 'bg-yellow-50/30' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${TYPE_BADGE[type] ?? 'bg-gray-100 text-gray-600'}`}>
          {type}
        </span>
        <span className="text-[10px] text-gray-400">{relTime(createdAt)}</span>
        {!isRead && <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full ml-auto" />}
      </div>
      <p className="text-sm text-gray-700 leading-snug group-hover:text-black transition-colors">{title}</p>
      {body && <p className="text-[11px] text-gray-400 mt-0.5 truncate">{body}</p>}
    </div>
  );
};

// ── All Notifications Modal ───────────────────────────────────
const NotificationsModal = ({ onClose }) => {
  const [page,    setPage]    = useState(1);
  const [items,   setItems]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(total / NOTIF_PAGE_SIZE) || 1;
  const start      = (page - 1) * NOTIF_PAGE_SIZE + 1;
  const end        = Math.min(page * NOTIF_PAGE_SIZE, total);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications({ page, pageSize: NOTIF_PAGE_SIZE });
      setItems(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch { /* show empty gracefully */ }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleMarkAllRead = async () => {
    try { await markAllAsRead(); load(); } catch { /* non-critical */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-base tracking-tight">All Notifications</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{total} total notifications</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleMarkAllRead}
              className="text-[11px] text-gray-500 hover:text-black transition-colors px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
              Mark all read
            </button>
            <button onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No notifications yet.</div>
          ) : (
            items.map((n) => (
              <NotificationItem key={n.id} title={n.title} body={n.body}
                type={n.type} createdAt={n.created_at} isRead={n.is_read} />
            ))
          )}
        </div>

        {/* Pagination footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
          <p className="text-xs text-gray-500">
            Showing <span className="font-bold text-gray-700">{start}–{end}</span> of{' '}
            <span className="font-bold text-gray-700">{total}</span>
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="min-w-[32px] h-8 px-2 rounded-lg text-xs flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${p === page ? 'bg-yellow-400 text-black shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="min-w-[32px] h-8 px-2 rounded-lg text-xs flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Logout Confirmation Modal ─────────────────────────────────
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCancel}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
      {/* Icon + text */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
          <LogOut size={22} className="text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base">Confirm Logout</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Are you sure you want to log out? Your session will be ended.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
        >
          Yes, Logout
        </button>
      </div>
    </div>
  </div>
);

// ── Main Layout ───────────────────────────────────────────────
const Layout = () => {
  const { user, logout, isGuest }      = useAuth();       // auth context — isGuest for guest banner
  const navigate                        = useNavigate();
  const [notifOpen,   setNotifOpen]     = useState(false); // bell dropdown
  const [modalOpen,   setModalOpen]     = useState(false); // all-notifications modal
  const [logoutModal, setLogoutModal]   = useState(false); // logout confirm modal
  const [unreadCount, setUnreadCount]   = useState(0);     // bell badge
  const [recentNotifs, setRecentNotifs] = useState([]);    // dropdown preview

  // Load recent 3 notifications for dropdown preview
  const loadRecentNotifs = useCallback(async () => {
    try {
      const res = await getNotifications({ page: 1, pageSize: 3 });
      setRecentNotifs(res.data || []);
      setUnreadCount(res.data?.filter((n) => !n.is_read).length || 0);
    } catch { /* non-critical */ }
  }, []);

  useEffect(() => { loadRecentNotifs(); }, [loadRecentNotifs]);

  // Confirm and execute logout
  const handleLogoutConfirm = () => {
    setLogoutModal(false);
    logout();
    navigate('/login', { replace: true });
  };

  const openModal = () => { setNotifOpen(false); setModalOpen(true); };

  // User display name from auth context
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const initials    = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : '?';
  const jobPosition = user?.jobPosition || 'Employee';

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-gray-900">

      {/* ── Guest mode banner — only visible when isGuest is true ── */}
      {isGuest && (
        <div className="w-full bg-[#111111] text-white text-[11px] font-semibold py-1.5 px-4 flex items-center justify-center gap-2 shrink-0 z-40">
          <span className="bg-gray-600 text-gray-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Demo</span>
          <span className="text-gray-300">You are viewing sample data in guest mode — changes are not saved.</span>
          <button
            onClick={() => { navigate('/login'); logout(); }}
            className="ml-2 text-[#FBC02D] hover:text-yellow-300 underline cursor-pointer transition-colors text-[10px]"
          >
            Login with an account →
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">

      {/* ====== SIDEBAR ====== */}
      {/* border-r adds clear visual separator between sidebar and content */}
      <div className="w-64 bg-white flex flex-col h-full shrink-0 border-r border-gray-200">
        <div className="flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 pt-8 pb-4">
            <span className="text-yellow-400 font-bold text-xl">HRIS</span>
            <span className="font-bold text-xl tracking-tight">HS SYSTEM</span>
          </div>

          <div className="px-4">
            <p className="text-[10px] text-gray-400 font-bold mb-2 ml-2 tracking-wider pt-6">MAIN</p>
            <nav className="space-y-1.5">
              <SidebarLink to="/dashboard"   icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <SidebarLink to="/attendance"  icon={<Fingerprint size={20} />}     label="My Attendance" />
              <SidebarLink to="/tasks" icon={<ClipboardList size={20} />}   label="My Task Board" />
              <SidebarLink to="/overtime"    icon={<Clock size={20} />}           label="My Overtime" />
              <SidebarLink to="/leave"       icon={<FileText size={20} />}        label="My Leave" />
              <SidebarLink to="/reports"     icon={<FileBarChart size={20} />}    label="My Report" />
            </nav>

            <p className="text-[10px] text-gray-400 font-bold mt-5 mb-2 ml-2 tracking-wider">SETTINGS</p>
            <nav className="space-y-1.5">
              <SidebarLink to="/calendar"   icon={<Calendar size={20} />}     label="Calendar" />
              <SidebarLink to="/event-type" icon={<Tags size={20} />}         label="Event Type" />
              <SidebarLink to="/add-event"  icon={<CalendarPlus size={20} />} label="Add Event" />
            </nav>
          </div>
        </div>

        {/* Sidebar footer: real user from auth context */}
        <div className="p-2 border-t border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-3 mb-1 px-2 pt-1">
            {/* Avatar with initials */}
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-yellow-400 font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs leading-tight truncate">{displayName}</p>
              <p className="text-[9px] text-gray-500 truncate">{jobPosition}</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full ml-auto shrink-0" />
          </div>
          <nav className="space-y-0.5 px-2 pb-1">
            <SidebarLink to="/profile" icon={<User size={20} />} label="Profile" />
            {/* Logout — opens confirmation modal */}
            <button
              onClick={() => setLogoutModal(true)}
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium w-full text-left cursor-pointer"
            >
              <LogOut size={20} />
              <span className="text-[14px]">Log Out</span>
            </button>
          </nav>
        </div>
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* Top header bar — border-b adds clear separator between navbar and content */}
        <header className="h-16 bg-white flex items-center justify-between px-8 shrink-0 relative z-40 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight" />
          <div className="flex items-center gap-6">
            <LiveClock />

            {/* Notification bell with badge */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="text-gray-600 hover:text-black transition-colors relative cursor-pointer p-1"
                aria-label="Notifications"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown panel */}
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-sm text-gray-800 tracking-tight">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-yellow-400 px-2 py-0.5 rounded-full font-bold">{unreadCount} NEW</span>
                      )}
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      {recentNotifs.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-sm">No notifications.</div>
                      ) : (
                        recentNotifs.map((n) => (
                          <NotificationItem key={n.id} title={n.title} body={n.body}
                            type={n.type} createdAt={n.created_at} isRead={n.is_read} />
                        ))
                      )}
                    </div>
                    <button
                      onClick={openModal}
                      className="w-full py-3 text-xs text-gray-500 hover:text-black hover:bg-gray-50 transition-colors font-medium border-t border-gray-100 cursor-pointer"
                    >
                      View all notifications →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* All Notifications Modal */}
      {modalOpen && <NotificationsModal onClose={() => setModalOpen(false)} />}

      {/* Logout Confirmation Modal */}
      {logoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setLogoutModal(false)}
        />
      )}
    </div> {/* end flex-1 overflow-hidden */}
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────

// Live clock in topbar — updates every second
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const date = time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const tick = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  return (
    <div className="text-gray-500 text-sm">
      {date} <span className="font-bold text-black ml-2">{tick}</span>
    </div>
  );
};

// Sidebar NavLink with active highlight
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors ${
        isActive
          ? 'bg-yellow-400 text-black font-bold shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-black font-medium'
      }`
    }
  >
    {icon}
    <span className="text-[14px]">{label}</span>
  </NavLink>
);

export default Layout;
