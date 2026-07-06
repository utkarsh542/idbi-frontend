import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers } from '../lib/api';
import { formatINR } from '../lib/formatters';
import { RefreshCcw, Shield } from 'lucide-react';

export default function CustomerPicker() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    const res = await getCustomers();
    if (res.error) {
      setError(res.message);
    } else {
      setCustomers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getRiskColor = (risk) => {
    if (risk === 'Conservative') return 'bg-brand-blue/10 text-brand-blue';
    if (risk === 'Moderate') return 'bg-brand-amber/10 text-brand-amber';
    if (risk === 'Aggressive') return 'bg-idbi-light/10 text-idbi-green';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-idbi-green flex items-center gap-2">
          <Shield className="text-idbi-light" size={32} />
          IDBI Bank <span className="text-gray-400 font-light mx-2">|</span> AI Wealth Advisor
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Select your profile to continue</p>
      </header>

      {error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex flex-col items-center justify-center border border-red-100 text-center">
          <p className="mb-4 text-lg">Unable to load customer profiles.</p>
          <p className="mb-6 text-sm opacity-80">{error}</p>
          <button 
            onClick={fetchCustomers}
            className="flex items-center gap-2 bg-white px-6 py-2 rounded-full font-medium text-red-600 shadow-sm hover:shadow transition-all"
          >
            <RefreshCcw size={16} /> Retry Connection
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-48">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {customers.map((c) => (
            <button 
              key={c.id} 
              onClick={() => navigate(`/dashboard/${c.id}`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-idbi-orange/50 hover:scale-[1.02] transition-all duration-300 text-left group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-idbi-orange transition-colors">{c.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(c.risk_profile)}`}>
                    {c.risk_profile}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-1">{c.occupation}</p>
                <p className="text-gray-500 text-sm mb-6">{c.city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900 tabular-nums-all">{formatINR(c.portfolio_value)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
