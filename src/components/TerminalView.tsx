import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Check, Search, ArrowDown } from 'lucide-react';

interface TerminalViewProps {
  logs: string[];
  title?: string;
  stepName?: string;
  status?: 'idle' | 'running' | 'success' | 'failed' | 'skipped';
  durationMs?: number;
}

export const TerminalView: React.FC<TerminalViewProps> = ({
  logs,
  title = 'Console Output',
  stepName,
  status = 'idle',
  durationMs
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = searchQuery
    ? logs.filter((log) => log.toLowerCase().includes(searchQuery.toLowerCase()))
    : logs;

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
            {stepName ? `${stepName}` : title}
          </span>
          {durationMs !== undefined && durationMs > 0 && (
            <span className="text-[11px] font-mono text-slate-500 tabular-nums">
              ({(durationMs / 1000).toFixed(2)}s)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative hidden sm:block">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="bg-slate-950 text-slate-300 text-[11px] pl-6 pr-2 py-0.5 rounded border border-slate-800 focus:outline-none focus:border-slate-700 w-28 lg:w-36 transition-all"
            />
          </div>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1 rounded transition-colors text-[11px] flex items-center gap-1 ${
              autoScroll ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Auto-scroll to bottom"
          >
            <ArrowDown className="w-3 h-3" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Copy logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Log Area */}
      <div
        ref={scrollRef}
        className="flex-1 p-3.5 overflow-y-auto font-mono text-xs leading-relaxed space-y-1 min-h-[240px] max-h-[460px] bg-slate-950/95"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 py-12 text-center">
            {searchQuery ? 'No log lines matched your query' : 'Press "Simulate Run" to stream workflow execution logs'}
          </div>
        ) : (
          filteredLogs.map((log, idx) => {
            const isError = log.includes('ERROR:') || log.includes('failed');
            const isSuccess = log.includes('successful') || log.includes('Successfully') || log.includes('✓') || log.includes('looks good');
            const isCommand = log.startsWith('>') || log.startsWith('Executing:') || log.startsWith('Running');
            const isHighlight = log.startsWith('dist/') || log.includes('https://');

            return (
              <div key={idx} className="flex items-start gap-3 group hover:bg-slate-900/40 px-1 rounded transition-colors">
                <span className="text-slate-600 select-none text-[11px] w-6 shrink-0 text-right tabular-nums group-hover:text-slate-500">
                  {idx + 1}
                </span>
                <span
                  className={`break-all whitespace-pre-wrap ${
                    isError
                      ? 'text-rose-400 font-semibold'
                      : isSuccess
                      ? 'text-emerald-400 font-medium'
                      : isCommand
                      ? 'text-cyan-300'
                      : isHighlight
                      ? 'text-amber-300'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </span>
              </div>
            );
          })
        )}
        {status === 'running' && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pt-1 px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-500 italic">Executing step...</span>
          </div>
        )}
      </div>
    </div>
  );
};
