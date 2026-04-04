import React, { useState, useEffect, useCallback } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Pencil, Save, X } from 'lucide-react';
import { getProfile, updateProfile } from '../../api/employeeApi.js';
import ValidationModal from '../../components/ValidationModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import EmploymentInfoTab from './tabs/employmentInfoTab.jsx';
import LeaveCreditsTab   from './tabs/leaveCreditsTab.jsx';

const TABS = [
  { key: 'overview',   label: 'Overview'       },
  { key: 'employment', label: 'Employment Info' },
  { key: 'leave',      label: 'Leave Credits'   },
];

// ── Read-only display helpers ─────────────────────────────────
const SectionHeader = ({ title }) => (
  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 mt-1">{title}</h3>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
      <Icon size={14} className="text-gray-400" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">{value || '—'}</p>
    </div>
  </div>
);

const GovIdRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span className="text-xs font-bold text-gray-700 font-mono">{value || '—'}</span>
  </div>
);

// ── Editable field component ──────────────────────────────────
const EditField = ({ label, name, value, onChange, type = 'text', placeholder = '' }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className="min-w-0 w-full">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors placeholder:text-gray-300"
      />
    </div>
  </div>
);

const EditSelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className="min-w-0 w-full">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D] transition-colors bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  </div>
);

// ── Overview Tab ──────────────────────────────────────────────
const OverviewTab = ({ profile, user, onProfileUpdated }) => {
  const [editing,   setEditing]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [editForm,  setEditForm]  = useState({});
  const [valModal,  setValModal]  = useState({ isOpen: false, type: 'error', title: '', messages: [] });

  const startEdit = () => {
    setEditForm({
      contact_number:    profile?.contact_number    || '',
      residence_address: profile?.residence_address || '',
      personal_email:    profile?.personal_email    || '',
      civil_status:      profile?.civil_status      || 'Single',
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({});
  };

  const handleChange = ({ target: { name, value } }) => {
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    // Basic email validation if filled
    if (editForm.personal_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.personal_email.trim())) {
      setValModal({ isOpen: true, type: 'error', title: 'Validation Error', messages: ['Please enter a valid personal email address.'] });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        contact_number:    editForm.contact_number.trim()    || null,
        residence_address: editForm.residence_address.trim() || null,
        personal_email:    editForm.personal_email.trim()    || null,
        civil_status:      editForm.civil_status             || null,
      };
      await updateProfile(payload);
      await onProfileUpdated();
      setEditing(false);
      setValModal({ isOpen: true, type: 'success', title: 'Profile Updated', messages: ['Your profile has been saved successfully.'] });
    } catch (err) {
      setValModal({ isOpen: true, type: 'error', title: 'Save Failed', messages: [err?.message || 'Failed to save profile. Please try again.'] });
    } finally {
      setSaving(false);
    }
  };

  const fmtDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information — editable */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <SectionHeader title="Personal Information" />
            {!editing ? (
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Pencil size={11} /> Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={11} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#111111] hover:bg-[#222] border border-transparent px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save size={11} /> {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <>
              <InfoRow icon={User}     label="Full Name"      value={profile?.full_name} />
              <InfoRow icon={Mail}     label="Company Email"  value={profile?.company_email || user?.email} />
              <InfoRow icon={Mail}     label="Personal Email" value={profile?.personal_email} />
              <InfoRow icon={Phone}    label="Contact Number" value={profile?.contact_number} />
              <InfoRow icon={MapPin}   label="Address"        value={profile?.residence_address} />
              <InfoRow icon={User}     label="Civil Status"   value={profile?.civil_status} />
              <InfoRow icon={Calendar} label="Birth Date"     value={fmtDate(profile?.birth_date)} />
            </>
          ) : (
            <>
              {/* Read-only fields during edit */}
              <InfoRow icon={User}     label="Full Name"      value={profile?.full_name} />
              <InfoRow icon={Mail}     label="Company Email"  value={profile?.company_email || user?.email} />
              <EditField
                label="Personal Email" name="personal_email"
                value={editForm.personal_email} onChange={handleChange}
                type="email" placeholder="personal@email.com"
              />
              <EditField
                label="Contact Number" name="contact_number"
                value={editForm.contact_number} onChange={handleChange}
                placeholder="+63 9XX XXX XXXX"
              />
              <EditField
                label="Address" name="residence_address"
                value={editForm.residence_address} onChange={handleChange}
                placeholder="Complete address"
              />
              <EditSelectField
                label="Civil Status" name="civil_status"
                value={editForm.civil_status} onChange={handleChange}
                options={['Single', 'Married', 'Widowed', 'Separated', 'Divorced']}
              />
              <InfoRow icon={Calendar} label="Birth Date" value={fmtDate(profile?.birth_date)} />
            </>
          )}
        </div>

        {/* Employment Info — read-only in overview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <SectionHeader title="Employment Information" />
          <InfoRow icon={Briefcase} label="Employee No."     value={profile?.employee_no} />
          <InfoRow icon={Briefcase} label="Job Position"     value={profile?.job_position} />
          <InfoRow icon={Briefcase} label="Department"       value={profile?.department} />
          <InfoRow icon={Briefcase} label="Work Arrangement" value={profile?.work_arrangement} />
          <InfoRow icon={Calendar}  label="Date Hired"       value={fmtDate(profile?.date_hired)} />
          <InfoRow icon={Calendar}  label="Date Regularized" value={fmtDate(profile?.date_regularized)} />
          <InfoRow icon={Calendar}  label="Last Login"       value={
            profile?.last_login
              ? new Date(profile.last_login).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '—'
          } />
        </div>

        {/* Government IDs — read-only */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <SectionHeader title="Government IDs" />
          <GovIdRow label="SSS Number"        value={profile?.sss_number} />
          <GovIdRow label="PhilHealth Number" value={profile?.philhealth_number} />
          <GovIdRow label="Pag-IBIG Number"   value={profile?.pagibig_number} />
          <GovIdRow label="TIN Number"        value={profile?.tin_number} />
        </div>

        {/* Account & Security */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <SectionHeader title="Account & Security" />
          <InfoRow icon={Shield} label="Login Email" value={profile?.company_email || user?.email} />
          <div className="py-2.5 border-b border-gray-50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Password</p>
            <p className="text-sm text-gray-400 italic">For password changes, contact IT Support</p>
          </div>
          <div className="py-2.5">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Account Status</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>

      <ValidationModal
        isOpen={valModal.isOpen}
        type={valModal.type}
        title={valModal.title}
        messages={valModal.messages}
        onClose={() => setValModal((v) => ({ ...v, isOpen: false }))}
      />
    </>
  );
};

// ── Main Profile Page ─────────────────────────────────────────
const Profile = () => {
  const { user }              = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [activeTab, setTab]   = useState('overview');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      setError(err?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const displayName = profile?.full_name || user?.fullName || 'Employee';
  const initials    = displayName.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-[#FBC02D] font-bold text-2xl shrink-0 shadow-sm overflow-hidden">
            {profile?.profile_photo_url
              ? <img src={profile.profile_photo_url} alt={displayName} className="w-full h-full object-cover" />
              : initials}
          </div>
          <div className="space-y-1.5 flex-1">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-6 bg-gray-100 rounded w-48" />
                <div className="h-4 bg-gray-100 rounded w-32" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
                <p className="text-sm text-gray-500">
                  {profile?.job_position || user?.jobPosition || '—'}
                  {(profile?.department || user?.department) && (
                    <span className="text-gray-400"> · {profile?.department || user?.department}</span>
                  )}
                </p>
                <div className="flex gap-2 flex-wrap mt-1">
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-md">Active</span>
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-md">
                    {profile?.work_arrangement || 'On-site'}
                  </span>
                  {profile?.employee_no && (
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-mono font-bold px-3 py-1 rounded-md">
                      {profile.employee_no}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ValidationModal
        isOpen={!!error}
        type="error"
        title="Failed to Load Profile"
        messages={error ? [error] : []}
        onClose={() => setError(null)}
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              className={`px-5 py-4 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
                activeTab === tab.key
                  ? 'border-yellow-400 text-gray-900 bg-yellow-50/40'
                  : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && !loading && (
          <OverviewTab
            profile={profile}
            user={user}
            onProfileUpdated={fetchProfile}
          />
        )}
        {activeTab === 'overview' && loading && (
          <div className="p-6 animate-pulse space-y-4">
            <div className="h-4 bg-gray-100 rounded w-1/3" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'employment' && <EmploymentInfoTab />}
        {activeTab === 'leave'      && <LeaveCreditsTab />}
      </div>
    </div>
  );
};

export default Profile;
