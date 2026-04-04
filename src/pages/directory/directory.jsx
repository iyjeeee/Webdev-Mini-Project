import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import StatCard from '../../components/statCard.jsx';
import Pagination from '../../components/Pagination.jsx';
import { getDirectory } from '../../api/employeeApi.js';

const PAGE_SIZE = 10;

// Generate initials avatar with a consistent color from name
const getAvatarColor = (name = '') => {
  const colors = [
    'bg-yellow-400 text-black',
    'bg-blue-500 text-white',
    'bg-green-500 text-white',
    'bg-purple-500 text-white',
    'bg-pink-500 text-white',
    'bg-indigo-500 text-white',
    'bg-orange-400 text-white',
    'bg-teal-500 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((n) => n[0]).join('').toUpperCase();

const daysSinceHired = (dateStr) => {
  if (!dateStr) return '';
  const hired = new Date(dateStr);
  const now   = new Date();
  const days  = Math.floor((now - hired) / 86400000);
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (years > 0) return `${years}y ${months}m`;
  if (months > 0) return `${months}mo`;
  return `${days}d`;
};

const ARRANGEMENT_STYLE = {
  'On-site': 'bg-gray-100 text-gray-600 border-gray-200',
  'Remote':  'bg-blue-50 text-blue-600 border-blue-100',
  'Hybrid':  'bg-purple-50 text-purple-600 border-purple-100',
};

const Directory = () => {
  const [employees,    setEmployees]   = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [error,        setError]       = useState('');
  const [search,       setSearch]      = useState('');
  const [deptFilter,   setDeptFilter]  = useState('');
  const [arrgFilter,   setArrgFilter]  = useState('');
  const [currentPage,  setPage]        = useState(1);

  const fetchDirectory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getDirectory();
      setEmployees(res.data || []);
    } catch (err) {
      setError('Failed to load directory. Please try again.');
      console.error('[Directory]', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDirectory(); }, [fetchDirectory]);

  // Derived data
  const departments = useMemo(() =>
    [...new Set(employees.map((e) => e.department).filter(Boolean))].sort(),
    [employees]
  );

  const stats = useMemo(() => ({
    total:  employees.length,
    active: employees.filter((e) => e.is_active).length,
    onLeave: 0, // not available from this endpoint directly
  }), [employees]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return employees.filter((emp) => {
      const matchSearch = !q
        || emp.full_name?.toLowerCase().includes(q)
        || emp.employee_no?.toLowerCase().includes(q)
        || emp.department?.toLowerCase().includes(q)
        || emp.job_position?.toLowerCase().includes(q)
        || emp.company_email?.toLowerCase().includes(q);
      const matchDept = !deptFilter || emp.department === deptFilter;
      const matchArrg = !arrgFilter || emp.work_arrangement === arrgFilter;
      return matchSearch && matchDept && matchArrg;
    });
  }, [employees, search, deptFilter, arrgFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged      = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const handleExportCSV = () => {
    const headers = ['Employee No', 'Full Name', 'Department', 'Position', 'Email', 'Contact', 'Arrangement', 'Date Hired', 'Status'];
    const rows = filtered.map((e) => [
      e.employee_no, e.full_name, e.department, e.job_position,
      e.company_email, e.contact_number, e.work_arrangement,
      e.date_hired ? new Date(e.date_hired).toLocaleDateString() : '',
      e.is_active ? 'Active' : 'Inactive',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url; a.download = 'employee-directory.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-10">

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Directory</h2>
          <p className="text-sm text-gray-400 mt-1">All employees across departments — Highly Succeed, Inc.</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={loading || filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-x divide-gray-200">
        <StatCard value={loading ? '—' : stats.total}  label="Total Employees" description="Across All Departments" />
        <StatCard value={loading ? '—' : stats.active} label="Active"          description="Currently Working" />
        <StatCard value={loading ? '—' : departments.length} label="Departments" description="Across the Company" />
      </div>

      {/* Filters + Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              placeholder="Search name, ID, department…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); resetPage(); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors cursor-pointer bg-white"
          >
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <select
            value={arrgFilter}
            onChange={(e) => { setArrgFilter(e.target.value); resetPage(); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors cursor-pointer bg-white"
          >
            <option value="">All Arrangements</option>
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <span className="ml-auto text-xs text-gray-400 font-medium whitespace-nowrap">
            {loading ? '—' : `${filtered.length} employee${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="px-5 py-4 bg-red-50 border-b border-red-100">
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button onClick={fetchDirectory} className="text-xs text-red-500 hover:text-red-700 underline mt-1 cursor-pointer">
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3">Date Hired</th>
                <th className="px-6 py-3">Arrangement</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0" />
                        <div>
                          <div className="h-4 bg-gray-100 rounded w-32 mb-1" />
                          <div className="h-3 bg-gray-100 rounded w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-36" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-14" /></td>
                  </tr>
                ))
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-300 text-sm font-semibold">
                    No employees found
                    {(search || deptFilter || arrgFilter) && (
                      <button
                        onClick={() => { setSearch(''); setDeptFilter(''); setArrgFilter(''); resetPage(); }}
                        className="block mx-auto mt-2 text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paged.map((emp) => {
                  const initials  = getInitials(emp.full_name);
                  const avatarCls = getAvatarColor(emp.full_name);
                  const hiredDate = emp.date_hired
                    ? new Date(emp.date_hired).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—';
                  const tenure = daysSinceHired(emp.date_hired);

                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      {/* Avatar + name + ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-sm font-black ${avatarCls}`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{emp.full_name}</p>
                            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{emp.employee_no}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <p className="text-[13px] text-gray-700 leading-tight truncate max-w-[180px]">{emp.company_email || '—'}</p>
                        <p className="text-[11px] text-gray-400">{emp.contact_number || '—'}</p>
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-bold text-gray-700">{emp.department || '—'}</span>
                      </td>

                      {/* Position */}
                      <td className="px-6 py-4">
                        <span className="text-[12px] font-medium text-gray-700 leading-tight">{emp.job_position || '—'}</span>
                      </td>

                      {/* Date hired */}
                      <td className="px-6 py-4">
                        <p className="text-[12px] font-bold text-gray-700">{hiredDate}</p>
                        {tenure && <p className="text-[11px] text-gray-400">{tenure} tenure</p>}
                      </td>

                      {/* Work arrangement */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 border rounded-md text-[10px] font-bold uppercase ${ARRANGEMENT_STYLE[emp.work_arrangement] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                          {emp.work_arrangement || '—'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${emp.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-[11px] font-bold text-gray-700">{emp.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="px-6 pb-4 pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
