import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

interface Message {
  text: string;
  isUser: boolean;
}

export const ChatbotWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { text: language === 'en' 
        ? "Hello! Ask me about 'api handler' or 'marketing email' to see mock outputs." 
        : "Xin chào! Hãy hỏi tôi về 'api handler' hoặc 'marketing email' để xem các bản mẫu.", 
      isUser: false 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isThinking) return;

    // Add user message
    setMessages(prev => [...prev, { text, isUser: true }]);
    setInputValue('');
    setIsThinking(true);

    // Simulated response timeout
    setTimeout(() => {
      setIsThinking(false);
      let replyText = t.ai.default;
      const query = text.toLowerCase();

      if (query.includes('email') || query.includes('marketing')) {
        replyText = t.ai.hook;
      } else if (query.includes('api') || query.includes('handler')) {
        replyText = t.ai.api;
      } else if (query.includes('price') || query.includes('giá') || query.includes('cost')) {
        replyText = t.ai.price;
      } else if (query.includes('hello') || query.includes('hi') || query.includes('chào')) {
        replyText = language === 'en'
          ? 'Hello! Ask me about "api handler" or "marketing email" to see mock outputs.'
          : 'Xin chào! Hãy hỏi tôi về "api handler" hoặc "marketing email" để chạy bản mẫu.';
      }

      setMessages(prev => [...prev, { text: replyText, isUser: false }]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-panel-strong/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 text-left flex flex-col h-[300px] justify-between theme-violet">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <h4 className="text-[13px] font-bold text-violet-400 uppercase tracking-wider">{t.ai.widget_title}</h4>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#00f5a0] bg-[#00f5a0]/10 px-2 py-0.5 rounded-full uppercase">
          <span className="w-1.5 h-1.5 bg-[#00f5a0] rounded-full animate-pulse" />
          {t.ai.widget_status}
        </span>
      </div>

      {/* Messages Panel */}
      <div className="flex-grow my-3 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 text-[12px] ${msg.isUser ? 'justify-end text-right' : ''}`}>
            {!msg.isUser && (
              <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <i className="fas fa-robot text-[10px]"></i>
              </div>
            )}
            <div className="max-w-[80%]">
              <span className="block text-[10px] text-text-muted mb-0.5">
                {msg.isUser ? (language === 'en' ? 'You' : 'Bạn') : 'Helitiva AI'}
              </span>
              <div className={`p-2.5 rounded-xl text-text-primary whitespace-pre-line leading-relaxed ${
                msg.isUser 
                  ? 'bg-violet-600/20 border border-violet-500/30 text-right rounded-tr-none' 
                  : 'bg-[#050608]/60 border border-white/5 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
            {msg.isUser && (
              <div className="w-6 h-6 rounded-full bg-zinc-700/50 border border-zinc-600/20 text-zinc-300 flex items-center justify-center shrink-0">
                <i className="fas fa-user text-[10px]"></i>
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-3 text-[11px] text-text-muted items-center animate-pulse">
            <div className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
              <i className="fas fa-spinner animate-spin text-[10px]"></i>
            </div>
            <div>
              <span className="block text-[10px] text-text-muted mb-0.5">Helitiva AI</span>
              <div className="bg-[#050608]/40 px-2.5 py-1.5 rounded-lg border border-white/5 italic">
                {t.ai.thinking}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input panel */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'en' ? 'Ask me something...' : 'Hỏi tôi điều gì đó...'}
          className="flex-grow px-3 py-2 bg-[#050608]/75 border border-white/5 rounded-xl text-[12px] focus:outline-none focus:border-violet-500/50 text-text-primary placeholder:text-text-muted"
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isThinking}
          className="px-3 bg-violet-500 hover:bg-violet-400 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-paper-plane text-[11px]"></i>
        </button>
      </div>
    </div>
  );
};
