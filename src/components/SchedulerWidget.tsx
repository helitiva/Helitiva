import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

interface ScheduledPost {
  text: string;
  time: string;
  network: 'linkedin' | 'twitter';
}

export const SchedulerWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const [postText, setPostText] = useState('');
  const [status, setStatus] = useState<'idle' | 'scheduled'>('idle');
  const [queue, setQueue] = useState<ScheduledPost[]>([
    { 
      text: language === 'en' 
        ? "How we launched a complete subscription billing SaaS in under 4 weeks: A technical breakdown."
        : "Cách chúng tôi khởi chạy SaaS thanh toán đăng ký hoàn chỉnh trong dưới 4 tuần: Bản phân tích kỹ thuật.",
      time: "Tomorrow, 9:00 AM", 
      network: "linkedin" 
    },
    { 
      text: language === 'en'
        ? "Why programmatic SEO is the most scalable white-hat growth channel for B2B SaaS platforms."
        : "Tại sao programmatic SEO là kênh tăng trưởng an toàn và dễ mở rộng nhất cho nền tảng B2B SaaS.",
      time: "June 7, 3:30 PM", 
      network: "twitter" 
    }
  ]);

  const handleSchedule = () => {
    if (!postText.trim()) return;

    const newPost: ScheduledPost = {
      text: postText.trim(),
      time: language === 'en' ? "Scheduled in Queue" : "Đã vào hàng đợi",
      network: Math.random() > 0.5 ? 'linkedin' : 'twitter'
    };

    setQueue(prev => [newPost, ...prev]);
    setPostText('');
    setStatus('scheduled');

    setTimeout(() => {
      setStatus('idle');
    }, 2000);
  };

  return (
    <div className="w-full bg-panel-strong/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-left theme-rose">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-[13px] font-bold text-rose-400 uppercase tracking-wider">{t.marketing.widget_title}</h4>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#00f5a0] bg-[#00f5a0]/10 px-2 py-0.5 rounded-full uppercase">
          <span className="w-1.5 h-1.5 bg-[#00f5a0] rounded-full animate-pulse" />
          {t.marketing.widget_status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Input Textarea */}
        <div className="relative">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder={t.marketing.post_placeholder}
            rows={2}
            className="w-full p-3 bg-[#050608]/75 border border-white/5 rounded-xl text-[12px] focus:outline-none focus:border-rose-500/50 text-text-primary placeholder:text-text-muted resize-none"
          />
          <button
            onClick={handleSchedule}
            disabled={!postText.trim() || status === 'scheduled'}
            className={`w-full mt-2 py-2 rounded-xl text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 ${
              status === 'scheduled'
                ? 'bg-[#00f5a0] text-[#030303]'
                : 'bg-rose-500 hover:bg-rose-400 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {status === 'scheduled' ? (
              <>
                <i className="fas fa-check-circle"></i>
                {t.marketing.sched_status}
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                {t.marketing.sched_btn}
              </>
            )}
          </button>
        </div>

        {/* Scheduled Posts Pipeline Queue */}
        <div className="border-t border-white/5 pt-3">
          <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-2">Social Queue</span>
          <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {queue.map((item, idx) => (
              <div key={idx} className="flex gap-2.5 p-2 bg-[#050608]/50 border border-white/5 rounded-lg text-[11px] items-start">
                <div className="shrink-0 mt-0.5">
                  {item.network === 'linkedin' ? (
                    <i className="fab fa-linkedin text-blue-400 text-[14px]"></i>
                  ) : (
                    <i className="fab fa-twitter text-cyan-400 text-[14px]"></i>
                  )}
                </div>
                <div className="min-w-0 flex-grow">
                  <p className="text-text-secondary truncate leading-tight">{item.text}</p>
                  <span className="text-[9px] text-text-muted mt-0.5 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
