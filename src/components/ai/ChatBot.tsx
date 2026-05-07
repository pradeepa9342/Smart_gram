'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ChatBot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: language === 'en' ? 'Hello! I am your SmartGram Administrative Assistant. I can provide contact details for village officers, office hours, and help with your complaints.' : 'வணக்கம்! நான் உங்கள் ஸ்மார்ட்கிராம் நிர்வாக உதவியாளர். கிராம அதிகாரிகள், அலுவலக நேரங்கள் மற்றும் உங்கள் புகார்களுக்கு நான் உதவ முடியும்.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      // Gather local context to provide "admin-created" details to the AI
      const villageContext = {
        water: JSON.parse(localStorage.getItem('smartgram-water') || '[]'),
        schemes: JSON.parse(localStorage.getItem('smartgram-schemes') || '[]'),
        agriculture: JSON.parse(localStorage.getItem('smartgram-agriculture') || '[]'),
        healthcare: JSON.parse(localStorage.getItem('smartgram-healthcare') || '[]'),
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          language,
          context: villageContext 
        }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: language === 'en'
            ? `Error: ${data.error || 'Could not get a response. Please try again.'}`
            : `பிழை: ${data.error || 'பதில் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'}`,
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: language === 'en'
          ? 'Network error. Please check your connection and try again.'
          : 'நெட்வொர்க் பிழை. உங்கள் இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
      }]);
    }

    setIsTyping(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />}
        {!isOpen && (
          <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-bounce">
            AI
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-emerald-600 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-black text-lg">SmartGram Assistant</h3>
                <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-bold uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                {m.role === 'bot' && (
                  <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg mb-1">
                    <Bot size={16} />
                  </div>
                )}
                <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                }`}>
                  {m.text}
                </div>
                {m.role === 'user' && (
                   <div className="bg-slate-200 text-slate-600 p-1.5 rounded-lg mb-1">
                     <User size={16} />
                   </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-center gap-2 text-emerald-600">
                <div className="bg-emerald-100 p-2 rounded-2xl flex gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-50">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'en' ? "Ask anything..." : "எது வேண்டுமானாலும் கேளுங்கள்..."}
                className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-6 pr-14 font-medium text-slate-800 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
