import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, X, AlertTriangle, PlusCircle } from 'lucide-react';
import { sendChat, getChatHistory, clearChatHistory } from '../lib/api';
import { useVoice } from '../hooks/useVoice';

const SUGGESTIONS = [
  "Am I on track for my goals?",
  "How is my portfolio performing?",
  "Should I increase my SIP amount?",
  "Can I afford a home loan in 3 years?",
  "Where am I overspending?"
];

export default function AdvisorOrb({ customerId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [orbState, setOrbState] = useState('idle'); // idle, listening, thinking, speaking
  const chatEndRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      const res = await getChatHistory(customerId);
      if (!res.error) {
        setHistory(res.data || []);
      }
    };
    if (isOpen) {
      loadHistory();
    }
  }, [customerId, isOpen]);

  const clearChat = async () => {
    setHistory([]);
    await clearChatHistory(customerId);
  };
  
  const { isListening, interimTranscript, startListening, stopListening, speak, cancelSpeak } = useVoice({
    onTranscript: (text) => handleSend(text),
    onSpeakStart: () => setOrbState('speaking'),
    onSpeakEnd: () => setOrbState('idle'),
    onBoundary: () => {
      // Small pulse effect on each word boundary is handled by adding a class temporarily
      const el = document.getElementById('advisor-orb-core');
      if (el) {
        el.classList.add('orb-speak-active');
        setTimeout(() => el.classList.remove('orb-speak-active'), 150);
      }
    }
  });

  useEffect(() => {
    if (isListening) setOrbState('listening');
    else if (orbState === 'listening') setOrbState('idle');
  }, [isListening]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isOpen, interimTranscript]);

  const handleSend = async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : input;
    if (!text.trim()) return;
    
    const userMessage = { role: 'user', content: text };
    const currentHistory = [...history, userMessage];
    setHistory(currentHistory);
    setInput('');
    setOrbState('thinking');
    
    try {
      const res = await sendChat(customerId, text);
      if (res.error) {
        setHistory(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to my systems right now." }]);
        setOrbState('idle');
        return;
      }
      
      const assistantMsg = { 
        role: 'assistant', 
        content: res.data.response,
        tool_trace: res.data.tool_trace,
        degraded: res.data.degraded
      };
      setHistory(prev => [...prev, assistantMsg]);
      setOrbState('idle'); // Ensure we clear the thinking state
      speak(res.data.response);
    } catch (e) {
      setHistory(prev => [...prev, { role: 'assistant', content: "An unexpected error occurred." }]);
      setOrbState('idle');
    }
  };

  const getToolDisplayName = (toolName) => {
    if (toolName === 'get_customer_profile') return "Fetched portfolio holdings";
    if (toolName === 'get_derived_financial_metrics') return "Analysed spending & returns";
    if (toolName === 'project_goal_feasibility') return "Projected goal feasibility";
    return toolName;
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-xl flex items-center justify-center orb-idle z-50 text-white hover:scale-105 transition-transform"
      >
        <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" style={{ animationDuration: '3s' }}></div>
        <Mic size={28} />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 w-full md:max-w-[420px] h-full bg-white shadow-2xl flex flex-col z-50 transform transition-transform duration-300 border-l border-gray-200">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between z-10 bg-white">
        <h2 className="font-semibold text-gray-800 tracking-wide">AI Wealth Advisor</h2>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button onClick={clearChat} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-600 transition-colors" title="Start New Chat">
              <PlusCircle size={16} />
              <span>New Chat</span>
            </button>
          )}
          <button onClick={() => { setIsOpen(false); cancelSpeak(); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors" title="Close">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-transparent flex flex-col gap-4">
        <div className="flex justify-center py-6">
          <div id="advisor-orb-core" className={`w-20 h-20 rounded-full shadow-lg relative orb-${orbState}`}>
            {orbState === 'thinking' && <div className="orb-thinking-inner"></div>}
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              {orbState === 'listening' ? <Mic size={24} className="animate-pulse" /> : null}
            </div>
          </div>
        </div>

        {history.length === 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(s)}
                className="bg-white border border-gray-200 text-sm text-gray-600 px-3 py-1.5 rounded-full hover:border-idbi-orange hover:text-idbi-orange transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
            <div className={`p-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-idbi-green text-white rounded-br-sm shadow-sm' : 'bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100'}`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
            {msg.role === 'assistant' && msg.degraded && (
              <div className="mt-1 flex items-center gap-1 text-xs text-brand-amber bg-amber-50 px-2 py-1 rounded-md">
                <AlertTriangle size={12} />
                <span>Running on cached data — full AI analysis unavailable</span>
              </div>
            )}
            {msg.role === 'assistant' && msg.tool_trace?.length > 0 && (
              <details className="mt-2 text-xs text-gray-500 group">
                <summary className="cursor-pointer hover:text-gray-700 flex items-center select-none">
                  <span className="mr-1">🔍 Sources used</span>
                </summary>
                <div className="mt-2 ml-4 flex flex-col gap-1 border-l-2 border-gray-200 pl-2 py-1">
                  {msg.tool_trace.map((t, idx) => (
                    <span key={idx} className="bg-white border border-gray-100 rounded-md px-2 py-1 shadow-sm text-gray-600">
                      ✓ {getToolDisplayName(t.name)}
                    </span>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
        {interimTranscript && (
          <div className="self-end max-w-[85%]">
            <div className="p-3 rounded-2xl bg-gray-100 border border-gray-200 text-gray-500 italic text-sm rounded-br-sm">
              {interimTranscript}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <button 
            type="button"
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onMouseLeave={stopListening}
            onClick={() => isListening ? stopListening() : startListening()}
            className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-idbi-green focus:ring-1 focus:ring-idbi-green transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="p-3 rounded-full bg-idbi-green text-white disabled:opacity-50 disabled:bg-gray-300 hover:bg-idbi-light transition-all shadow-sm"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
