import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

export const SeoWidget: React.FC = () => {
  const { t } = useLanguage();
  const [level, setLevel] = useState(2);
  const [displayTraffic, setDisplayTraffic] = useState(48200);

  const paths = {
    1: 'M0,18 L12,16 L25,17 L38,15 L50,16 L62,14 L75,15 L88,13 L100,12',
    2: 'M0,18 L12,15 L25,16 L38,11 L50,13 L62,9 L75,10 L88,7 L100,5',
    3: 'M0,18 L12,14 L25,13 L38,8 L50,9 L62,4 L75,5 L88,2 L100,1'
  };

  const getTrafficValue = (lvl: number) => {
    if (lvl === 1) return 12400;
    if (lvl === 2) return 48200;
    return 156000;
  };

  const targetTraffic = getTrafficValue(level);

  // Smooth value counter animation
  useEffect(() => {
    if (displayTraffic === targetTraffic) return;
    
    const duration = 250; // ms
    const stepTime = 10;
    const steps = duration / stepTime;
    const diff = targetTraffic - displayTraffic;
    const increment = diff / steps;
    
    let current = displayTraffic;
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= targetTraffic) || (increment < 0 && current <= targetTraffic)) {
        setDisplayTraffic(targetTraffic);
        clearInterval(timer);
      } else {
        setDisplayTraffic(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [level, targetTraffic, displayTraffic]);

  const activePath = paths[level as 1 | 2 | 3] || paths[2];

  return (
    <div className="w-full bg-panel-strong/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-left theme-emerald">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-[13px] font-bold text-emerald-400 uppercase tracking-wider">{t.seo.widget_title}</h4>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#00f5a0] bg-[#00f5a0]/10 px-2 py-0.5 rounded-full uppercase">
          <span className="w-1.5 h-1.5 bg-[#00f5a0] rounded-full animate-pulse" />
          {t.seo.widget_status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Sparkline Graph */}
        <div className="bg-[#050608]/85 border border-white/5 rounded-xl p-4 flex items-center justify-center relative overflow-hidden h-[100px]">
          <svg 
            viewBox="0 0 100 20" 
            preserveAspectRatio="none" 
            className="w-full h-full absolute inset-0 text-emerald-400 overflow-visible"
          >
            <defs>
              <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f5a0" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00f5a0" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Sparkline Path Area Fill */}
            <path
              d={`${activePath} L100,20 L0,20 Z`}
              fill="url(#sparkline-grad)"
              className="transition-all duration-300"
            />
            {/* Sparkline Path Line */}
            <path
              d={activePath}
              fill="none"
              stroke="#00f5a0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
              style={{ filter: 'drop-shadow(0px 0px 4px rgba(0, 245, 160, 0.5))' }}
            />
          </svg>
          <div className="absolute top-2 left-3 text-[9px] font-bold text-text-muted uppercase tracking-wider">organic traffic projection</div>
        </div>

        {/* Slider */}
        <div>
          <div className="flex justify-between text-[11px] text-text-secondary mb-1">
            <span>{t.seo.slider_label}</span>
            <span className="font-bold text-white text-[12px]">{level === 1 ? 'Basic' : level === 2 ? 'Advanced' : 'Programmatic SEO Scaling'}</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={level}
            onChange={(e) => setLevel(parseInt(e.target.value))}
            className="w-full cursor-pointer accent-emerald-400"
            style={{ '--c': '16, 185, 129' } as React.CSSProperties}
          />
        </div>

        {/* Counter Display */}
        <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
          <span className="text-[12px] text-text-secondary">{t.seo.projected_label}</span>
          <div className="text-right">
            <span className="text-[26px] font-extrabold text-[#00f5a0] font-mono">+{displayTraffic.toLocaleString()}</span>
            <span className="text-[11px] text-text-muted"> /mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
