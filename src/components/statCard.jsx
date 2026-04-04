import React from 'react';

const StatCard = ({ value, label, description }) => (
  <div className="flex flex-col p-6 bg-white"> {/* individual cell — border handled by parent divide-x */}
    <h3 className="text-4xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm font-bold text-gray-800 mb-0.5">{label}</p>
    <p className="text-[11px] text-gray-400 leading-tight">{description}</p>
  </div>
);

export default StatCard;
