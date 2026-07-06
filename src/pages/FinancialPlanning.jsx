import React, { useState, useEffect } from 'react';
import { Home, Car, GraduationCap, Heart, Plane, Shield } from 'lucide-react';

const goalDefaults = {
  'Buy House': { corpus: 15000000, min: 2000000, max: 50000000, step: 500000, years: 10 },
  'Buy Car': { corpus: 1500000, min: 300000, max: 5000000, step: 100000, years: 3 },
  'Child Education': { corpus: 5000000, min: 1000000, max: 20000000, step: 200000, years: 15 },
  'Marriage': { corpus: 3000000, min: 500000, max: 10000000, step: 100000, years: 5 },
  'Vacation': { corpus: 500000, min: 100000, max: 2000000, step: 50000, years: 1 },
  'Retirement': { corpus: 40000000, min: 5000000, max: 150000000, step: 1000000, years: 25 },
};

const FinancialPlanning = () => {
  const [activeGoalTitle, setActiveGoalTitle] = useState('Buy House');
  const [sipStarted, setSipStarted] = useState(false);
  
  const [corpus, setCorpus] = useState(goalDefaults['Buy House'].corpus);
  const [inflation, setInflation] = useState(6);
  const [returns, setReturns] = useState(12);

  // Update default corpus when goal changes
  useEffect(() => {
    setCorpus(goalDefaults[activeGoalTitle].corpus);
  }, [activeGoalTitle]);

  const calculateSIP = () => {
    // Basic SIP calculation
    const monthlyRate = (returns / 100) / 12;
    const years = goalDefaults[activeGoalTitle].years;
    const months = years * 12; 
    
    // Inflation adjusted future value
    const adjustedCorpus = corpus * Math.pow((1 + inflation / 100), years);
    
    // SIP Formula: P = M * [ (1+i)^n - 1 ] / i
    // M = P * i / [ (1+i)^n - 1 ]
    if (monthlyRate === 0) return Math.round(adjustedCorpus / months);
    
    const sip = (adjustedCorpus * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(sip);
  };

  const goals = [
    { title: 'Buy House', icon: <Home size={32} /> },
    { title: 'Buy Car', icon: <Car size={32} /> },
    { title: 'Child Education', icon: <GraduationCap size={32} /> },
    { title: 'Marriage', icon: <Heart size={32} /> },
    { title: 'Vacation', icon: <Plane size={32} /> },
    { title: 'Retirement', icon: <Shield size={32} /> },
  ];

  const currentDefaults = goalDefaults[activeGoalTitle];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title text-gradient">Financial Planning</h1>
        <p className="page-subtitle">Set goals and let AI calculate your trajectory</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {goals.map((goal, idx) => {
          const isActive = activeGoalTitle === goal.title;
          return (
            <div 
              key={idx} 
              onClick={() => setActiveGoalTitle(goal.title)}
              className="glass-panel" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px', 
                cursor: 'pointer',
                border: 'none',
                background: isActive ? 'var(--idbi-teal-dark)' : '#ffffff',
                boxShadow: isActive ? '0 10px 24px rgba(0, 103, 71, 0.3)' : '0 4px 16px rgba(0, 0, 0, 0.06)',
                transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.3s ease',
                padding: '32px 16px',
                borderRadius: '16px'
              }}
            >
              <div style={{ color: isActive ? '#ffffff' : 'var(--idbi-teal)', transition: 'color 0.3s ease' }}>
                {goal.icon}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '500', textAlign: 'center', color: isActive ? '#ffffff' : 'var(--idbi-teal)', transition: 'color 0.3s ease' }}>
                {goal.title}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px' }}>Goal Parameters ({currentDefaults.years} Years)</h3>
          
          <div className="slider-group">
            <label>
              <span>Target Corpus (Today's Value)</span>
              <span>₹{corpus.toLocaleString('en-IN')}</span>
            </label>
            <input 
              type="range" 
              min={currentDefaults.min} 
              max={currentDefaults.max} 
              step={currentDefaults.step}
              value={corpus} 
              onChange={(e) => setCorpus(Number(e.target.value))} 
            />
          </div>

          <div className="slider-group">
            <label>
              <span>Expected Inflation</span>
              <span>{inflation}%</span>
            </label>
            <input 
              type="range" 
              min="2" 
              max="12" 
              step="1"
              value={inflation} 
              onChange={(e) => setInflation(Number(e.target.value))} 
            />
          </div>

          <div className="slider-group">
            <label>
              <span>Expected Returns</span>
              <span>{returns}%</span>
            </label>
            <input 
              type="range" 
              min="5" 
              max="20" 
              step="1"
              value={returns} 
              onChange={(e) => setReturns(Number(e.target.value))} 
            />
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Investment Required</h3>
          
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', margin: '24px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Monthly SIP</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--idbi-teal)' }}>
                ₹{calculateSIP().toLocaleString('en-IN')}
              </div>
            </div>
            
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>One-Time Lumpsum</div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--idbi-orange)' }}>
                ₹{Math.round((corpus * Math.pow((1 + inflation / 100), currentDefaults.years)) / Math.pow(1 + returns/100, currentDefaults.years)).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '90%', lineHeight: '1.5', fontSize: '14px' }}>
            To reach your inflation-adjusted target of ₹{Math.round(corpus * Math.pow((1 + inflation / 100), currentDefaults.years)).toLocaleString('en-IN')} in {currentDefaults.years} years, you can either start a Monthly SIP or make a One-Time Lumpsum investment today.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button 
              onClick={() => setSipStarted(true)}
              style={{ padding: '12px 24px', background: 'var(--idbi-teal)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer' }}
            >
              {sipStarted ? 'SIP Initiated!' : 'Start SIP'}
            </button>
            <button 
              style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--idbi-orange)', borderRadius: '8px', color: 'var(--idbi-orange)', fontWeight: '600', cursor: 'pointer' }}
            >
              Invest Lumpsum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanning;
