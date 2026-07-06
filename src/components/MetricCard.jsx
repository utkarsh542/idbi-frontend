import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, colorClass = "text-idbi-green" }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className={`p-2 rounded-full bg-gray-50 ${colorClass}`}>
            <Icon size={20} />
          </div>
        )}
        <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-900 tabular-nums-all">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
