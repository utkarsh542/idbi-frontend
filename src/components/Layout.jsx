import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Target, Activity, Users, Sparkles } from 'lucide-react';
import ChatWidget from './ChatWidget';
import { getCustomers } from '../lib/api';

const Layout = ({ customerId, setCustomerId }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <svg viewBox="0 0 100 100" width="40" height="40" style={{ flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '50%' }}>
            {/* White Background Circle */}
            <circle cx="50" cy="50" r="50" fill="#ffffff" />
            {/* Center Person / "I" shape */}
            <circle cx="50" cy="28" r="8" fill="var(--idbi-orange)" />
            <rect x="42" y="41" width="16" height="38" rx="8" fill="var(--idbi-orange)" />
            {/* Left Arc */}
            <path d="M 32,25 C 10,40 10,60 32,75 C 20,60 20,40 32,25 Z" fill="var(--idbi-orange)" />
            {/* Right Arc */}
            <path d="M 68,25 C 90,40 90,60 68,75 C 80,60 80,40 68,25 Z" fill="var(--idbi-orange)" />
          </svg>
          <span style={{ fontSize: '26px', fontWeight: '500', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Wealth<span style={{ fontWeight: '800', color: 'var(--idbi-orange)' }}>AI</span>
          </span>
        </div>

        {/* Customer Selector */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontWeight: '600' }}>
            <Users size={14} /> Active Profile
          </label>
          <select 
            value={customerId} 
            onChange={(e) => setCustomerId(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#ffffff',
              fontFamily: 'inherit',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {customers.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#ffffff', color: '#1e293b' }}>
                {c.name} - {c.risk_profile}
              </option>
            ))}
          </select>
        </div>
        
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} end>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/planning" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <Target size={20} />
              Financial Planning
            </NavLink>
          </li>
          <li>
            <NavLink to="/health" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              <Activity size={20} />
              Wealth Health Score
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Floating Chat Widget Overlay */}
      <ChatWidget customerId={customerId} />
    </div>
  );
};

export default Layout;
