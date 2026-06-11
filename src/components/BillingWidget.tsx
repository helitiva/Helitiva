import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

export const BillingWidget: React.FC = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState(12000);

  // Math logic ported from original index.js
  const calculateMetrics = (mau: number) => {
    let monthlyCost = 0;
    let apiCalls = 0;
    let dbRows = 0;

    if (mau <= 5000) {
      monthlyCost = 49;
      apiCalls = mau * 25;
      dbRows = mau * 4;
    } else if (mau <= 25000) {
      monthlyCost = 149;
      apiCalls = mau * 40;
      dbRows = mau * 8;
    } else {
      monthlyCost = Math.round(149 + (mau - 25000) * 0.005);
      apiCalls = mau * 60;
      dbRows = mau * 12;
    }

    return {
      cost: monthlyCost,
      apiCalls: apiCalls.toLocaleString(),
      dbRows: dbRows.toLocaleString(),
    };
  };

  const metrics = calculateMetrics(users);

  return (
    <div className="w-full bg-panel-strong/60 backdrop-blur-md border border-white/5 rounded-2xl p-6 text-left theme-sky">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[13px] font-bold text-sky-400 uppercase tracking-wider">{t.webapp.widget_title}</h4>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#00f5a0] bg-[#00f5a0]/10 px-2 py-0.5 rounded-full uppercase">
          <span className="w-1.5 h-1.5 bg-[#00f5a0] rounded-full animate-pulse" />
          {t.webapp.widget_status}
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-[12px] text-text-secondary mb-2">
            <span>{t.webapp.slider_label}</span>
            <span className="font-bold text-white text-[13px]">{users.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={users}
            onChange={(e) => setUsers(parseInt(e.target.value))}
            className="w-full cursor-pointer accent-sky-400"
            style={{ '--c': '56, 189, 248' } as React.CSSProperties}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
          <div className="bg-[#050608]/50 p-3 rounded-lg border border-white/5">
            <span className="block text-[10px] text-text-muted uppercase tracking-wider">API calls / month</span>
            <span className="text-[14px] font-mono font-bold text-sky-300">{metrics.apiCalls}</span>
          </div>
          <div className="bg-[#050608]/50 p-3 rounded-lg border border-white/5">
            <span className="block text-[10px] text-text-muted uppercase tracking-wider">Database Rows</span>
            <span className="text-[14px] font-mono font-bold text-sky-300">{metrics.dbRows}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-3 border-t border-white/5">
          <span className="text-[12px] text-text-secondary">{t.webapp.cost_label}</span>
          <div className="text-right">
            <span className="text-[28px] font-extrabold text-white font-mono">${metrics.cost}</span>
            <span className="text-[11px] text-text-muted">/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
