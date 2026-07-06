import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getCustomerMetrics } from '../lib/api';

const Dashboard = ({ customerId }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getCustomerMetrics(customerId);
        setMetrics(data);
      } catch (err) {
        console.error("Failed to load metrics", err);
      } finally {
        setLoading(false);
      }
    };
    if (customerId) fetchMetrics();
  }, [customerId]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading...</div>;
  }

  if (!metrics) {
    return <div>Failed to load data.</div>;
  }

  // Format data for Recharts (Spending trend)
  const chartData = metrics.spending_trend_6m.map((val, idx) => ({
    name: `Month ${idx + 1}`,
    value: val
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title text-gradient">Wealth Dashboard</h1>
        <p className="page-subtitle">Your comprehensive financial overview</p>
      </div>

      <div className="grid-cards">
        <div className="glass-panel stat-card">
          <div className="stat-title">Net Worth</div>
          <div className="stat-value">₹{(metrics.portfolio_value).toLocaleString()}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={16} /> +{metrics.weighted_return}% returns
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-title">Monthly Spending</div>
          <div className="stat-value">₹{sumObjectValues(metrics.monthly_expenses).toLocaleString()}</div>
          <div className="stat-change negative">
            <ArrowDownRight size={16} /> Tracking trend
          </div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-title">Monthly Income</div>
          <div className="stat-value">₹{(metrics.monthly_income).toLocaleString()}</div>
          <div className="stat-change positive">
            <ArrowUpRight size={16} /> {metrics.savings_rate}% Savings Rate
          </div>
        </div>
      </div>

      <div className="responsive-grid-2-1">
        <div className="glass-panel" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '24px' }}>Spending Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--idbi-teal)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--idbi-teal)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Area type="monotone" dataKey="value" stroke="var(--idbi-teal)" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '24px' }}>Asset Allocation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
            {Object.entries(metrics.asset_allocation || {})
              .filter(([_, val]) => val > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', textTransform: 'capitalize' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{key.replace('_', ' ')}</span>
                  <span style={{ color: 'var(--idbi-teal)', fontWeight: '600' }}>{val}%</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: `${val}%`, backgroundColor: 'var(--idbi-teal)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Bills Section */}
      <div className="glass-panel" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '24px' }}>Personal Expenses & Bills</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {metrics.monthly_expenses?.detailed_bills?.map((bill, idx) => (
            <div key={idx} style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              backgroundColor: bill.essential ? 'rgba(0, 133, 117, 0.05)' : 'rgba(244, 121, 32, 0.05)',
              border: `1px solid ${bill.essential ? 'rgba(0, 133, 117, 0.2)' : 'rgba(244, 121, 32, 0.2)'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{bill.name}</h4>
                <span style={{ fontWeight: '600', color: bill.essential ? 'var(--idbi-teal)' : 'var(--idbi-orange)' }}>₹{bill.amount.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {bill.category} • {bill.essential ? 'Essential' : 'Discretionary / Highlight'}
              </div>
            </div>
          ))}
          {(!metrics.monthly_expenses?.detailed_bills || metrics.monthly_expenses.detailed_bills.length === 0) && (
            <div style={{ color: 'var(--text-secondary)' }}>No detailed bills found for this profile.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function
function sumObjectValues(obj) {
  if (!obj) return 0;
  let total = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'number') total += obj[key];
  }
  return total;
}

export default Dashboard;
