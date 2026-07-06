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

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
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
          <h3 style={{ marginBottom: '24px' }}>Health Score Portfolio</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="health-score-circle">
              <div className="health-score-content">
                <div className="health-score-value">
                  {/* Mock health score calculation based on savings rate */}
                  {Math.min(100, Math.round((metrics.savings_rate / 30) * 100))}
                </div>
                <div className="health-score-label">
                  {metrics.savings_rate >= 20 ? 'Excellent' : 'Fair'}
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Savings Health</span>
              <span style={{ color: 'var(--accent-green)' }}>{metrics.savings_rate}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${Math.min(100, (metrics.savings_rate / 30) * 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
function sumObjectValues(obj) {
  if (!obj) return 0;
  return Object.values(obj).reduce((a, b) => a + b, 0);
}

export default Dashboard;
