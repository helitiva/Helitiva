import React, { useEffect, useState, useRef } from 'react';

interface TerminalLine {
  text: string;
  type: 'cmd' | 'info' | 'success' | 'warning' | 'error';
}

const TERMINAL_LOGS: TerminalLine[] = [
  { text: "helitiva-labs --deploy --target=production", type: "cmd" },
  { text: "[INIT] Starting product engineering pipelines...", type: "info" },
  { text: "[BUILD] Compiling SaaS core components... OK", type: "success" },
  { text: "[DATABASE] Sync complete: 34 relational tables mapped.", type: "success" },
  { text: "[AI] Injecting agent RAG vectors into LLM context...", type: "info" },
  { text: "[AI] Generating index collections. Latency: 0.8s", type: "success" },
  { text: "[SEO] Generating programmatic sitemap and metadata...", type: "info" },
  { text: "[SEO] Optimizing page speed parameters. LCP: 0.9s", type: "success" },
  { text: "[DEPLOY] Launching serverless cluster...", type: "info" },
  { text: "[SUCCESS] Build successfully deployed. Status: ACTIVE.", type: "success" },
];

export const ActiveTerminal: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [activeCommandText, setActiveCommandText] = useState("");
  const [logIndex, setLogIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logIndex >= TERMINAL_LOGS.length) {
      // Delay and restart simulation
      const timeout = setTimeout(() => {
        setLines([]);
        setActiveCommandText("");
        setLogIndex(0);
      }, 5000);
      return () => clearTimeout(timeout);
    }

    const currentLog = TERMINAL_LOGS[logIndex];

    if (currentLog.type === 'cmd') {
      // Typewriter effect for commands
      let charIdx = 0;
      setActiveCommandText("");

      const interval = setInterval(() => {
        if (charIdx < currentLog.text.length) {
          setActiveCommandText(prev => prev + currentLog.text.charAt(charIdx));
          charIdx++;
        } else {
          clearInterval(interval);
          // Add typed command to list and move to next log
          setTimeout(() => {
            setLines(prev => [...prev, `$ ${currentLog.text}`]);
            setActiveCommandText("");
            setLogIndex(prev => prev + 1);
          }, 800);
        }
      }, 45);

      return () => clearInterval(interval);
    } else {
      // Pushing info/success log lines with status colors
      const delay = currentLog.type === 'success' ? 800 : 500;
      const timeout = setTimeout(() => {
        let prefix = "";
        if (currentLog.type === 'success') prefix = "🟢 ";
        if (currentLog.type === 'info') prefix = "🔵 ";
        
        setLines(prev => [...prev, `${prefix}${currentLog.text}`]);
        setLogIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [logIndex]);

  // Scroll terminal logs to bottom on update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, activeCommandText]);

  const getLineClass = (line: string) => {
    if (line.startsWith('$')) return 'text-accent font-bold';
    if (line.includes('[SUCCESS]') || line.startsWith('🟢')) return 'text-emerald-400';
    if (line.includes('[INIT]') || line.includes('[DEPLOY]') || line.startsWith('🔵')) return 'text-cyan-400';
    return 'text-text-secondary';
  };

  return (
    <div className="terminal-window w-full aspect-[4/3] sm:aspect-[1.5/1] flex flex-col overflow-hidden text-[12px] md:text-[13px] border border-white/5 rounded-xl bg-[#050608] shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="terminal-header flex items-center justify-between px-4 py-2.5 bg-[#0c0d12]/80 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="terminal-dot bg-red-500 w-2.5 h-2.5 rounded-full" />
          <span className="terminal-dot bg-yellow-500 w-2.5 h-2.5 rounded-full" />
          <span className="terminal-dot bg-green-500 w-2.5 h-2.5 rounded-full" />
        </div>
        <div className="text-text-muted text-[10px] uppercase font-bold tracking-wider">production_build.log</div>
        <div className="w-12" />
      </div>

      {/* Terminal Content Body */}
      <div 
        ref={containerRef}
        className="flex-grow p-4 overflow-y-auto space-y-1.5 font-mono text-left scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
      >
        {lines.map((line, idx) => (
          <div key={idx} className={getLineClass(line)}>
            {line}
          </div>
        ))}
        {activeCommandText && (
          <div className="text-accent font-bold">
            $ {activeCommandText}
            <span className="terminal-cursor bg-accent w-1.5 h-3 inline-block ml-1 animate-pulse" />
          </div>
        )}
        {!activeCommandText && logIndex < TERMINAL_LOGS.length && (
          <div className="text-text-secondary">
            <span className="terminal-cursor bg-zinc-600 w-1.5 h-3 inline-block ml-1 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
