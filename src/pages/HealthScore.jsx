import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { getCustomerMetrics } from '../lib/api';

const CircularProgress = ({ score, color }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '160px', height: '160px' }}>
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="rgba(0, 0, 0, 0.05)"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress stroke */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
        />
      </svg>
      {/* Center text */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '48px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1' }}>{score}</span>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Out of 100</span>
      </div>
    </div>
  );
};

const HealthScore = ({ customerId }) => {
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

  const savingsScore = Math.min(100, Math.round((metrics.savings_rate / 30) * 100));
  const returnScore = Math.min(100, Math.max(0, Math.round((metrics.weighted_return / 12) * 100)));
  const liquidAssets = (metrics.asset_allocation?.debt || 0) + (metrics.asset_allocation?.other || 0);
  const emergencyScore = Math.min(100, Math.round((liquidAssets / 100) * 100)); 
  const overallScore = Math.round((savingsScore + returnScore + emergencyScore) / 3);

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--accent-green)';
    if (score >= 50) return 'var(--idbi-orange)';
    return '#ef4444'; // Red for poor
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="page-title text-gradient">Wealth Health Score</h1>
        <p className="page-subtitle">A deep dive into your financial well-being based on your portfolio, emergency funds, and spending trends.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px', marginBottom: '32px' }}>
        
        {/* Left Column: Overall Health */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'linear-gradient(180deg, rgba(0, 133, 117, 0.05) 0%, rgba(0, 133, 117, 0.15) 100%)' }}>
          <h2 style={{ marginBottom: '40px', color: 'var(--text-primary)', fontSize: '20px', fontWeight: '500' }}>Overall Health</h2>
          
          <CircularProgress score={overallScore} color={getScoreColor(overallScore)} />
          
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '6px 16px', 
              borderRadius: '999px', 
              backgroundColor: `#ffffff`,
              color: getScoreColor(overallScore),
              fontWeight: '600',
              fontSize: '16px',
              border: `1px solid ${getScoreColor(overallScore)}40`
            }}>
              {getScoreText(overallScore)} Status
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Breakdown */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '32px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--idbi-teal)" />
            Health Breakdown
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Metric 1: Savings */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'rgba(0, 133, 117, 0.1)', borderRadius: '8px' }}>
                    <TrendingUp size={20} color="var(--idbi-teal)" />
                  </div>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>Savings Rate ({metrics.savings_rate}%)</span>
                  </div>
                </div>
                <span style={{ color: getScoreColor(savingsScore), fontWeight: '600', fontSize: '15px' }}>{getScoreText(savingsScore)}</span>
              </div>
              <div className="progress-bar-bg" style={{ height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <div className="progress-bar-fill" style={{ width: `${savingsScore}%`, backgroundColor: getScoreColor(savingsScore) }}></div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.5' }}>
                You save {metrics.savings_rate}% of your income. Financial experts typically recommend maintaining a savings rate between 20-30% for long-term wealth creation.
              </p>
            </div>

            {/* Metric 2: Returns */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'rgba(0, 133, 117, 0.1)', borderRadius: '8px' }}>
                    <TrendingUp size={20} color="var(--idbi-teal)" />
                  </div>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>Portfolio Returns ({metrics.weighted_return}%)</span>
                  </div>
                </div>
                <span style={{ color: getScoreColor(returnScore), fontWeight: '600', fontSize: '15px' }}>{getScoreText(returnScore)}</span>
              </div>
              <div className="progress-bar-bg" style={{ height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <div className="progress-bar-fill" style={{ width: `${returnScore}%`, backgroundColor: getScoreColor(returnScore) }}></div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.5' }}>
                Your weighted portfolio return is {metrics.weighted_return}%. This tracks your asset performance against the historical market average of 10-12%.
              </p>
            </div>

            {/* Metric 3: Emergency Fund */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'rgba(0, 133, 117, 0.1)', borderRadius: '8px' }}>
                    <ShieldCheck size={20} color="var(--idbi-teal)" />
                  </div>
                  <div>
                    <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>Emergency Fund & Liquid Assets</span>
                  </div>
                </div>
                <span style={{ color: getScoreColor(emergencyScore), fontWeight: '600', fontSize: '15px' }}>{getScoreText(emergencyScore)}</span>
              </div>
              <div className="progress-bar-bg" style={{ height: '8px', backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                <div className="progress-bar-fill" style={{ width: `${emergencyScore}%`, backgroundColor: getScoreColor(emergencyScore) }}></div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.5' }}>
                Evaluates the proportion of your portfolio held in highly liquid, low-risk assets (Debt/Liquid Funds) available to cover 3-6 months of unexpected emergencies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '20px' }}>
          <div style={{ padding: '8px', background: 'rgba(244, 121, 32, 0.1)', borderRadius: '8px' }}>
            <AlertTriangle size={20} color="var(--idbi-orange)" />
          </div>
          Actionable Insights
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {savingsScore < 70 && (
             <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(244, 121, 32, 0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
               <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} color="var(--idbi-orange)"/> Improve Savings Rate</h4>
               <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>Consider reducing discretionary spending to boost your savings rate closer to the 20% mark. Review your monthly expenses in the dashboard.</p>
             </div>
          )}
          {returnScore < 70 && (
             <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(244, 121, 32, 0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
               <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} color="var(--idbi-orange)"/> Optimize Portfolio</h4>
               <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>Your portfolio returns are below optimal. Open the AI Coach chat and ask for a detailed asset reallocation strategy to boost returns.</p>
             </div>
          )}
          {emergencyScore < 70 && (
             <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(244, 121, 32, 0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
               <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} color="var(--idbi-orange)"/> Build Liquid Assets</h4>
               <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>You may not have enough liquid assets. Consider redirecting some equity investments into a high-yield liquid fund for emergencies.</p>
             </div>
          )}
          {overallScore >= 80 && (
             <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid rgba(0, 133, 117, 0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
               <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-green)"/> Excellent Foundation</h4>
               <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>Your financial basics are perfectly covered. With a strong health score, you can afford to focus on long-term aggressive wealth creation.</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default HealthScore;
