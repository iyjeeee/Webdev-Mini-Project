import React from 'react';
import { FileText, Download } from 'lucide-react';

const PAYSLIPS = [
  { period: 'March 1-15, 2026',  sub: '1st Cutoff · March 2026',  file: 'Payday_March1st_1st.pdf',  released: 'March 20, 2026' },
  { period: 'March 16-31, 2026', sub: '2nd Cutoff · March 2026',  file: 'Payday_March1st_2nd.pdf',  released: 'March 30, 2026' },
  { period: 'April 1-15, 2026',  sub: '1st Cutoff · April 2026',  file: 'Payday_April1st_1st.pdf',  released: 'March 20, 2026' },
  { period: 'April 16-31, 2026', sub: '2nd Cutoff · April 2026',  file: 'Payday_April1st_2nd.pdf',  released: 'March 30, 2026' },
  { period: 'May 1-15, 2026',    sub: '1st Cutoff · May 2026',    file: 'Payday_May1500_1st.pdf',   released: 'March 20, 2026' },
];

const PayslipsTab = () => (
  <div className="p-6">
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-200 flex items-center gap-2">
        <FileText size={15} className="text-gray-400" />
        <h3 className="font-bold text-sm text-gray-700">My Payslips</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              <th className="px-5 py-3">Payslip Period</th>
              <th className="px-5 py-3">Payslip File</th>
              <th className="px-5 py-3">Date Released</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PAYSLIPS.map((slip, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                {/* Period */}
                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-gray-800">{slip.period}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{slip.sub}</p>
                </td>

                {/* File */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-600 font-medium">{slip.file}</span>
                  </div>
                </td>

                {/* Date Released */}
                <td className="px-5 py-4">
                  <span className="text-xs text-gray-600">{slip.released}</span>
                </td>

                {/* Action */}
                <td className="px-5 py-4">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer">
                    <Download size={13} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default PayslipsTab;