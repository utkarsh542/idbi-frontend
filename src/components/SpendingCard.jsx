import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatINR } from '../lib/formatters';

export default function SpendingCard({ customer, metrics }) {
  if (!metrics) return null;

  // Defensive defaults for charts
  const trendData = (metrics.spending_trend_6m || [0,0,0,0,0,0]).map((val, i) => ({
    month: `M${i+1}`,
    amount: val
  }));

  const breakdownData = [
    { name: 'Essentials', value: metrics.monthly_expenses?.essentials || 0, color: '#A0AEC0' },
    { name: 'Discretionary', value: metrics.monthly_expenses?.discretionary || 0, color: '#A0AEC0' },
    { name: 'EMI', value: metrics.monthly_expenses?.emi || 0, color: '#E53E3E' }, // Red
    { name: 'Savings', value: metrics.savings_rate ? (metrics.monthly_income * (metrics.savings_rate/100)) : 0, color: '#006747' } // Green
  ].filter(d => d.value > 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Spending & Savings</h2>
      
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">6-Month Trend</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F7" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#718096' }} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#718096' }}
                tickFormatter={(val) => `₹${val/1000}k`}
              />
              <Tooltip 
                formatter={(val) => formatINR(val)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="amount" stroke="#4A90D9" strokeWidth={3} dot={{ r: 4, fill: '#4A90D9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-4">Monthly Breakdown</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EDF2F7" />
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#718096' }}
                tickFormatter={(val) => `₹${val/1000}k`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#4A5568' }}
                width={85}
              />
              <Tooltip 
                formatter={(val) => formatINR(val)}
                cursor={{ fill: '#F7F8FA' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
