import React from 'react';
import { formatINR } from '../lib/formatters';

export default function GoalsCard({ metrics }) {
  if (!metrics || !metrics.goal_progress || metrics.goal_progress.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Goals</h2>
        <p className="text-gray-500 text-sm">No goals defined yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Financial Goals</h2>
      <div className="space-y-6">
        {metrics.goal_progress.map((goal, index) => {
          const progressPct = goal.progress_pct || 0;
          const targetAmount = goal.target_amount || 0;
          const currentAmount = goal.current_amount || 0;
          const remaining = targetAmount - currentAmount;
          
          let barColor = 'bg-brand-red';
          if (progressPct >= 70) barColor = 'bg-idbi-green';
          else if (progressPct >= 40) barColor = 'bg-brand-amber';

          let priorityColor = 'bg-gray-200 text-gray-700';
          if (goal.priority === 'High') priorityColor = 'bg-red-100 text-red-700';
          else if (goal.priority === 'Medium') priorityColor = 'bg-amber-100 text-amber-700';

          return (
            <div key={index} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:border-gray-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{goal.goal_name}</h3>
                  <p className="text-sm text-gray-500">Target Year: {goal.target_year}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColor}`}>
                  {goal.priority || 'Low'} Priority
                </span>
              </div>
              
              <div className="mt-4 mb-2 flex justify-between text-sm">
                <span className="font-medium text-gray-700">{formatINR(currentAmount)}</span>
                <span className="text-gray-500 text-right">Target: {formatINR(targetAmount)}</span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`} 
                  style={{ width: `${Math.min(progressPct, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-right">
                {remaining > 0 ? `${formatINR(remaining)} to go` : 'Goal reached!'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
