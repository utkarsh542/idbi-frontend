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
  const [mfStarted, setMfStarted] = useState(false);
  const [etfStarted, setEtfStarted] = useState(false);
  const [bondsStarted, setBondsStarted] = useState(false);
  const [goldStarted, setGoldStarted] = useState(false);
  
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

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px', textAlign: 'center' }}>Recommended Strategy</h3>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Monthly Investment Required</div>
            <div style={{ fontSize: '40px', fontWeight: '700', color: 'var(--idbi-teal)' }}>
              ₹{calculateSIP().toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              To reach ₹{Math.round(corpus * Math.pow((1 + inflation / 100), currentDefaults.years)).toLocaleString('en-IN')} in {currentDefaults.years} years
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
            {/* SIP */}
            <div style={{ padding: '16px', border: '1px solid rgba(0, 133, 117, 0.2)', borderRadius: '12px', backgroundColor: 'rgba(0, 133, 117, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Systematic Investment Plan (30%)</div>
                <div style={{ fontWeight: '700', color: 'var(--idbi-teal)' }}>₹{Math.round(calculateSIP() * 0.3).toLocaleString('en-IN')}</div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>Disciplined monthly investing for compounding growth.</p>
              <button onClick={() => setSipStarted(true)} style={{ width: '100%', padding: '8px', background: sipStarted ? 'rgba(0, 133, 117, 0.2)' : 'var(--idbi-teal)', border: sipStarted ? '1px solid var(--idbi-teal)' : 'none', borderRadius: '6px', color: sipStarted ? 'var(--idbi-teal)' : 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {sipStarted ? '✓ SIP Active' : 'Start SIP'}
              </button>
            </div>

            {/* Mutual Funds */}
            <div style={{ padding: '16px', border: '1px solid rgba(0, 133, 117, 0.2)', borderRadius: '12px', backgroundColor: 'rgba(0, 133, 117, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>IDBI Mutual Funds (20%)</div>
                <div style={{ fontWeight: '700', color: 'var(--idbi-teal)' }}>₹{Math.round(calculateSIP() * 0.2).toLocaleString('en-IN')}</div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>Active fund management for alpha generation.</p>
              <button onClick={() => setMfStarted(true)} style={{ width: '100%', padding: '8px', background: mfStarted ? 'rgba(0, 133, 117, 0.2)' : 'transparent', border: '1px solid var(--idbi-teal)', borderRadius: '6px', color: mfStarted ? 'var(--idbi-teal)' : 'var(--idbi-teal)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {mfStarted ? '✓ MF Invested' : 'Invest in MF'}
              </button>
            </div>

            {/* ETFs */}
            <div style={{ padding: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', backgroundColor: 'rgba(139, 92, 246, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Index ETFs (20%)</div>
                <div style={{ fontWeight: '700', color: '#8b5cf6' }}>₹{Math.round(calculateSIP() * 0.2).toLocaleString('en-IN')}</div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>Low-cost passive investing tracking market indices.</p>
              <button onClick={() => setEtfStarted(true)} style={{ width: '100%', padding: '8px', background: etfStarted ? 'rgba(139, 92, 246, 0.2)' : 'transparent', border: '1px solid #8b5cf6', borderRadius: '6px', color: '#8b5cf6', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {etfStarted ? '✓ ETF Purchased' : 'Buy ETFs'}
              </button>
            </div>

            {/* Corporate Bonds */}
            <div style={{ padding: '16px', border: '1px solid rgba(244, 121, 32, 0.2)', borderRadius: '12px', backgroundColor: 'rgba(244, 121, 32, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Corporate Bonds (15%)</div>
                <div style={{ fontWeight: '700', color: 'var(--idbi-orange)' }}>₹{Math.round(calculateSIP() * 0.15).toLocaleString('en-IN')}</div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>Fixed income to reduce volatility and secure steady returns.</p>
              <button onClick={() => setBondsStarted(true)} style={{ width: '100%', padding: '8px', background: bondsStarted ? 'rgba(244, 121, 32, 0.2)' : 'transparent', border: '1px solid var(--idbi-orange)', borderRadius: '6px', color: 'var(--idbi-orange)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {bondsStarted ? '✓ Bonds Explored' : 'Explore Bonds'}
              </button>
            </div>

            {/* Digital Gold */}
            <div style={{ padding: '16px', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Digital Gold (15%)</div>
                <div style={{ fontWeight: '700', color: '#ca8a04' }}>₹{Math.round(calculateSIP() * 0.15).toLocaleString('en-IN')}</div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>Safe-haven asset acting as a natural hedge against market crashes.</p>
              <button onClick={() => setGoldStarted(true)} style={{ width: '100%', padding: '8px', background: goldStarted ? 'rgba(234, 179, 8, 0.2)' : 'transparent', border: '1px solid #ca8a04', borderRadius: '6px', color: '#ca8a04', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {goldStarted ? '✓ Gold Purchased' : 'Buy Digital Gold'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanning;
