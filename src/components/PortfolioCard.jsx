import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatINR } from '../lib/formatters';

const COLORS = {
  equity: '#006747', // IDBI Green
  debt: '#F5A623',   // Amber
  other: '#4A90D9'   // Blue
};

export default function PortfolioCard({ metrics }) {
  if (!metrics || !metrics.asset_allocation) return null;

  const data = [
    { name: 'Equity', value: metrics.asset_allocation.equity || 0, color: COLORS.equity },
    { name: 'Debt', value: metrics.asset_allocation.debt || 0, color: COLORS.debt },
    { name: 'Other', value: metrics.asset_allocation.other || 0, color: COLORS.other },
  ].filter(d => d.value > 0);

  const totalValue = metrics.portfolio_value || 0;
  const weightedReturn = metrics.weighted_return || 0;
  const isPositive = weightedReturn >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm text-gray-500 mb-1">Total Value</p>
          <div className="text-4xl font-bold text-gray-900 tabular-nums-all mb-2">
            {formatINR(totalValue)}
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-idbi-green' : 'text-brand-red'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(weightedReturn).toFixed(2)}% Overall Return</span>
          </div>
        </div>
        
        <div className="w-full md:w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value) => `${value.toFixed(1)}%`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Top Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 font-medium">
              <tr>
                <th className="pb-2">Asset</th>
                <th className="pb-2">Type</th>
                <th className="pb-2 text-right">Value</th>
                <th className="pb-2 text-right">Return</th>
              </tr>
            </thead>
            <tbody>
              {(metrics.holdings || []).map((h, i) => (
                <tr key={i} className="border-t border-gray-50">
                  <td className="py-3 font-medium text-gray-900">{h.name}</td>
                  <td className="py-3 text-gray-500 capitalize">{h.type}</td>
                  <td className="py-3 text-right tabular-nums-all">{formatINR(h.value)}</td>
                  <td className={`py-3 text-right tabular-nums-all font-medium ${h.returns >= 0 ? 'text-idbi-green' : 'text-brand-red'}`}>
                    {h.returns > 0 ? '+' : ''}{h.returns}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
