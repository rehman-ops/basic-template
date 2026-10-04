import React from 'react';
import { Play, Copy, Check, Terminal } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
  onCopyWorkflow: () => void;
  isCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onRunSimulation,
  isRunning,
  onCopyWorkflow,
  isCopied
}) => {
  const navItems = [
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'readiness', label: 'Readiness Audit' },
    { id: 'customizer', label: 'Workflow Config' },
    { id: 'guide', label: 'Setup Guide' },
    { id: 'spa-router', label: 'SPA Sandbox' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-colors">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Terminal className="w-4 h-4" />
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('pipeline');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors cursor-pointer"
        >
          PagesDeploy
        </a>
      </div>

      {/* Zone 2: Navigation Links (Single-line controls) */}
      <nav className="hidden md:flex items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onCopyWorkflow}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          title="Copy .github/workflows/deploy.yml to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy deploy.yml</span>
            </>
          )}
        </button>

        <button
          onClick={onRunSimulation}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm shadow-emerald-950 whitespace-nowrap"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Running Run...' : 'Simulate Run'}</span>
        </button>
      </div>
    </header>
  );
};
