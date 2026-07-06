import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, AlertCircle, Mic } from 'lucide-react';
import { getChatHistory, sendChatMessage } from '../lib/api';

const ChatWidget = ({ customerId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history when opened
  useEffect(() => {
    if (isOpen && customerId) {
      loadHistory();
    }
  }, [isOpen, customerId]);

  const loadHistory = async () => {
    try {
      const history = await getChatHistory(customerId);
      // Backend returns [{"role": "user"/"assistant", "content": "..."}]
      // We map "assistant" to "ai" for our CSS classes
      setMessages(history.map(msg => ({
        role: msg.role === 'assistant' ? 'ai' : msg.role,
        content: msg.content
      })));
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setInput(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(customerId, userMessage);
      setMessages(prev => [...prev, { role: 'ai', content: response.response }]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        className={`chat-widget-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      <div className={`chat-widget-window glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-widget-header">
          <div className="chat-widget-avatar">
            <svg className="avatar-pulse" viewBox="0 0 100 100" width="48" height="48" style={{ flexShrink: 0, borderRadius: '50%' }}>
              <defs>
                <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#f4f7f6" />
                  <stop offset="100%" stopColor="#d1d5db" />
                </radialGradient>
                <linearGradient id="orange3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffad66" />
                  <stop offset="40%" stopColor="var(--idbi-orange)" />
                  <stop offset="100%" stopColor="#cc5500" />
                </linearGradient>
                <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" />
                </filter>
              </defs>
              
              <circle cx="50" cy="50" r="50" fill="url(#sphereGrad)" />
              
              <g filter="url(#dropShadow)">
                <circle cx="50" cy="28" r="8" fill="url(#orange3D)" />
                <rect x="42" y="41" width="16" height="38" rx="8" fill="url(#orange3D)" />
                <path d="M 32,25 C 10,40 10,60 32,75 C 20,60 20,40 32,25 Z" fill="url(#orange3D)" />
                <path d="M 68,25 C 90,40 90,60 68,75 C 80,60 80,40 68,25 Z" fill="url(#orange3D)" />
              </g>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', margin: 0 }}>AI Financial Coach</h3>
            <span style={{ fontSize: '12px', color: 'var(--accent-green)' }}>Online</span>
          </div>
        </div>

        <div className="chat-widget-messages">
          {messages.length === 0 && !isLoading && (
            <div className="chat-message msg-ai" style={{ padding: '10px 14px', fontSize: '14px' }}>
              Hello! I'm your AI Financial Advisor. How can I help you today?
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role === 'ai' ? 'msg-ai' : 'msg-user'}`} style={{ padding: '10px 14px', fontSize: '14px' }}>
              {msg.content}
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-message msg-ai" style={{ padding: '10px 14px', fontSize: '14px' }}>
              Thinking...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-widget-input" style={{ alignItems: 'center' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your coach..." 
            disabled={isLoading || isListening}
          />
          <div 
            onClick={startListening}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer', 
              color: isListening ? 'var(--idbi-orange)' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              transform: isListening ? 'scale(1.1)' : 'scale(1)'
            }}
            title="Click to speak"
          >
            <Mic size={22} className={isListening ? 'avatar-pulse' : ''} style={{ borderRadius: '50%' }} />
          </div>
          <button onClick={handleSend} disabled={isLoading || input.trim() === ''}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
