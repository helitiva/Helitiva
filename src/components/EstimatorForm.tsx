import React, { useState } from 'react';
import { useLanguage } from './LanguageContext';

export const EstimatorForm: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // Steps: 1, 2, 3, 4 (Success)
  
  // Form State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>('mvp');
  const [projectDescription, setProjectDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Error handling
  const [serviceError, setServiceError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleService = (serviceKey: string) => {
    setServiceError(false);
    if (selectedServices.includes(serviceKey)) {
      setSelectedServices(prev => prev.filter(s => s !== serviceKey));
    } else {
      setSelectedServices(prev => [...prev, serviceKey]);
    }
  };

  const handleNextStep1 = () => {
    if (selectedServices.length === 0) {
      setServiceError(true);
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !projectDescription.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulated API request
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4); // Show Success State
    }, 1000);
  };

  const progressPercent = ((step - 1) / 2) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-panel/60 backdrop-blur-xl border border-white-6 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Background radial spotlight grid decoration */}
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {step < 4 && (
        <div className="relative z-10 mb-8">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
              {t.form.tag}
            </span>
            <span className="text-[11px] font-bold text-text-secondary font-mono">
              {t.form.step.replace('{num}', step.toString())}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Contents */}
      {step === 1 && (
        <div className="relative z-10 space-y-6">
          <h3 className="text-[16px] sm:text-[18px] font-bold text-text-primary">
            {t.form.step1_title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'webapp', title: t.form.step1_opt1, icon: 'fa-layer-group', color: 'text-sky-400' },
              { id: 'ai', title: t.form.step1_opt2, icon: 'fa-robot', color: 'text-violet-400' },
              { id: 'marketing', title: t.form.step1_opt3, icon: 'fa-paper-plane', color: 'text-rose-400' },
              { id: 'seo', title: t.form.step1_opt4, icon: 'fa-arrow-trend-up', color: 'text-emerald-400' },
            ].map(srv => {
              const isSelected = selectedServices.includes(srv.id);
              return (
                <button
                  type="button"
                  key={srv.id}
                  onClick={() => toggleService(srv.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/10 text-white'
                      : 'border-white-6 bg-panel-strong/40 text-text-secondary hover:bg-panel-soft/60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-[#050608]/80 flex items-center justify-center border border-white/5 ${srv.color}`}>
                    <i className={`fas ${srv.icon} text-[13px]`}></i>
                  </div>
                  <span className="text-[13px] font-bold">{srv.title}</span>
                </button>
              );
            })}
          </div>

          {serviceError && (
            <p className="text-[12px] text-red-400 flex items-center gap-1.5 animate-pulse">
              <i className="fas fa-exclamation-triangle"></i>
              {t.form.step1_err}
            </p>
          )}

          <div className="flex justify-end pt-4 border-t border-white-6">
            <button
              type="button"
              onClick={handleNextStep1}
              className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer"
            >
              {t.form.btn_next} <i className="fas fa-arrow-right ml-1 text-[9px]"></i>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="relative z-10 space-y-6">
          <h3 className="text-[16px] sm:text-[18px] font-bold text-text-primary">
            {t.form.step2_title}
          </h3>

          <div className="space-y-3">
            {[
              { id: 'prototype', title: t.form.step2_opt1_title, desc: t.form.step2_opt1_desc, border: 'hover:border-sky-500/50', activeBorder: 'border-sky-500 bg-sky-500/10' },
              { id: 'mvp', title: t.form.step2_opt2_title, desc: t.form.step2_opt2_desc, border: 'hover:border-violet-500/50', activeBorder: 'border-violet-500 bg-violet-500/10' },
              { id: 'scale', title: t.form.step2_opt3_title, desc: t.form.step2_opt3_desc, border: 'hover:border-emerald-500/50', activeBorder: 'border-emerald-500 bg-emerald-500/10' },
            ].map(opt => {
              const isActive = selectedBudget === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedBudget(opt.id)}
                  className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border text-left transition-all ${
                    isActive
                      ? opt.activeBorder
                      : `border-white-6 bg-panel-strong/40 ${opt.border} text-text-secondary`
                  }`}
                >
                  <div className="mb-2 sm:mb-0">
                    <span className="block text-[13px] font-bold text-text-primary">{opt.title}</span>
                    <span className="text-[11px] text-text-muted mt-0.5 block">{opt.desc}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isActive && <i className="fas fa-check-circle text-[14px]"></i>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white-6">
            <button
              type="button"
              onClick={handleBack}
              className="btn-ghost px-5 py-2.5 rounded-xl text-[13px] font-bold"
            >
              {t.form.btn_back}
            </button>
            <button
              type="button"
              onClick={handleNextStep2}
              className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold"
            >
              {t.form.btn_next} <i className="fas fa-arrow-right ml-1 text-[9px]"></i>
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-text-primary mb-2">
                {t.form.step3_title}
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder={t.form.step3_placeholder}
                rows={4}
                required
                className="w-full p-3 bg-[#050608]/75 border border-white-6 rounded-xl text-[13px] focus:outline-none focus:border-accent/50 text-text-primary placeholder:text-text-muted resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
                  {t.form.name_label}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full p-3 bg-[#050608]/75 border border-white-6 rounded-xl text-[13px] focus:outline-none focus:border-accent/50 text-text-primary placeholder:text-text-muted"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-text-secondary mb-1.5">
                  {t.form.email_label}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full p-3 bg-[#050608]/75 border border-white-6 rounded-xl text-[13px] focus:outline-none focus:border-accent/50 text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="btn-ghost px-5 py-2.5 rounded-xl text-[13px] font-bold disabled:opacity-50"
            >
              {t.form.btn_back}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim() || !projectDescription.trim()}
              className="btn-primary px-6 py-2.5 rounded-xl text-[13px] font-bold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner animate-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  {t.form.btn_submit}
                  <i className="fas fa-paper-plane text-[9px]"></i>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {step === 4 && (
        <div className="relative z-10 py-6 text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto text-accent text-3xl">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3 className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight">
            {t.form.success_title}
          </h3>
          <p className="text-[13px] text-text-secondary leading-relaxed max-w-md mx-auto">
            {t.form.success_desc}
          </p>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setSelectedServices([]);
              setSelectedBudget('mvp');
              setProjectDescription('');
              setName('');
              setEmail('');
            }}
            className="btn-ghost mt-4 px-6 py-2 rounded-xl text-[12px] font-bold"
          >
            Submit Another Request
          </button>
        </div>
      )}
    </div>
  );
};
