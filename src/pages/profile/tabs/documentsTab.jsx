import React from 'react';
import { Files } from 'lucide-react';

const DOCUMENTS = [
  { title: 'Signed Employment Contract', category: 'Legal Contract',     submitted: 'Oct 26, 2025',      status: 'Received' },
  { title: 'BIR Clearance',             category: 'Pre-Employment',     submitted: 'Oct 29, 2025',      status: 'Received' },
  { title: 'SSS E1/E4 Form',            category: 'Government Benefit', submitted: 'Oct 29, 2025',      status: 'Received' },
  { title: 'PhilHealth MDR Form',       category: 'Government Benefit', submitted: 'Oct 29, 2025',      status: 'Received' },
  { title: 'Pag-IBIG Membership Form (MDF)', category: 'Government Benefit', submitted: 'Oct 29, 2025', status: 'Received' },
  { title: 'BIR Form 2316 (Prior Employer)', category: 'Tax',           submitted: 'Nov 03, 2025',      status: 'Ongoing' },
  { title: 'Birth Certificate (PSA)',   category: 'Personal/Civil',     submitted: 'Not yet submitted', status: 'Pending' },
];

const STATUS_STYLE = {
  Received: 'bg-green-500 text-white',
  Ongoing:  'bg-blue-500 text-white', 
  Pending:  'bg-yellow-400 text-white',
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold shadow-sm ${STATUS_STYLE[status] ?? 'bg-gray-200 text-gray-600'}`}>
      {status}
    </span>
  );
};

const DocumentsTab = () => (
  <div className="p-6">
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Files size={15} className="text-gray-400" />
          <h3 className="font-bold text-sm text-gray-700">My Documents</h3>
        </div>
        <span className="text-[11px] text-gray-400 font-medium">
          {DOCUMENTS.filter(d => d.status === 'Received').length}/{DOCUMENTS.length} files submitted requirements
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              <th className="px-5 py-3">Document Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date Submitted</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {DOCUMENTS.map((doc, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <span className="text-sm font-semibold text-gray-800">{doc.title}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs text-gray-500">{doc.category}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs ${doc.submitted === 'Not yet submitted' ? 'text-gray-400 italic' : 'text-gray-600'}`}>
                    {doc.submitted}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={doc.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default DocumentsTab;