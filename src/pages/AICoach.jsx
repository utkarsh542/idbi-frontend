import React, { useState } from 'react';
import { Send, Zap, AlertCircle } from 'lucide-react';

const AICoach = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AI Financial Avatar. I've analyzed your recent debit/credit transactions and salary credits. How can I help you optimize your spending today?" },
    { role: 'ai', content: "By the way, I noticed a $45 recurring charge for a streaming service you haven't used in 3 months. Would you like me to cancel that?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: "Based on your spending pattern and risk profile, I recommend moving that $45/month into an ETF or adding it to your Emergency Fund." }]);
    }, 1000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="page-header">
          <h1 className="page-title text-gradient">AI Financial Avatar</h1>
          <p className="page-subtitle">Your personal coach for spending and behavior analysis</p>
        </div>

        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0' }}>
          <div className="ai-avatar-container" style={{ borderBottom: '1px solid var(--border-color)', margin: '0', padding: '40px 0' }}>
            <div className="avatar-orb"></div>
          </div>
          
          <div className="chat-feed" style={{ flex: 1, padding: '24px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role === 'ai' ? 'msg-ai' : 'msg-user'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask your financial coach..." 
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', color: 'white', outline: 'none' }}
            />
            <button 
              onClick={handleSend}
              style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', border: 'none', borderRadius: '12px', width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '24px' }}>Behavior Analysis Insights</h3>
        <div className="glass-panel" style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '12px', color: 'var(--accent-orange)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 style={{ marginBottom: '4px' }}>Unnecessary Expenses</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>Food delivery apps account for 15% of your card usage this month. Cooking at home could save you $120.</p>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '12px', color: 'var(--accent-green)' }}>
            <Zap size={24} />
          </div>
          <div>
            <h4 style={{ marginBottom: '4px' }}>Saving Opportunities</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>Your salary credit just arrived. Consider increasing your SIP by 5% this month based on your goal trajectory.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
