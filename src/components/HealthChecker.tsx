import React, { useState } from 'react';
import { HealthCheckItem } from '../types/workflow';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  FileCode,
  ShieldCheck,
  FolderTree,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface HealthCheckerProps {
  checks: HealthCheckItem[];
  onRerunAudit: () => void;
  isAuditing: boolean;
}

export const HealthChecker: React.FC<HealthCheckerProps> = ({
  checks,
  onRerunAudit,
  isAuditing
}) => {
  const [filter, setFilter] = useState<'all' | 'passed' | 'warning' | 'failed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const passedCount = checks.filter((c) => c.status === 'passed').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;
  const failedCount = checks.filter((c) => c.status === 'failed').length;

  const filteredChecks = checks.filter((check) => {
    if (filter === 'all') return true;
    return check.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Top Audit Summary */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Repository Deployment Readiness</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">GitHub Actions CI/CD</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Project Health & Pre-flight Validator
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Inspects files, environment settings, and Vite configuration against the exact checks executed by the workflow runner.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRerunAudit}
              disabled={isAuditing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditing Repo...' : 'Re-run Pre-flight'}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Passed Checks</span>
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {passedCount}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Warnings</span>
            <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
              {warningCount}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Failures</span>
            <span className="text-lg font-bold font-mono text-rose-400 tabular-nums">
              {failedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Checks ({checks.length})
        </button>
        <button
          onClick={() => setFilter('passed')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
            filter === 'passed'
              ? 'bg-slate-800 text-emerald-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Passed ({passedCount})
        </button>
        {warningCount > 0 && (
          <button
            onClick={() => setFilter('warning')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'warning'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Warnings ({warningCount})
          </button>
        )}
        {failedCount > 0 && (
          <button
            onClick={() => setFilter('failed')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'failed'
                ? 'bg-slate-800 text-rose-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Failures ({failedCount})
          </button>
        )}
      </div>

      {/* Checks List */}
      <div className="space-y-3">
        {filteredChecks.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800/80 bg-slate-950/70 overflow-hidden hover:border-slate-700 transition-colors"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {item.status === 'passed' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {item.status === 'warning' && (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    {item.status === 'failed' && (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {item.title}
                      </h3>
                      {item.file && (
                        <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded">
                          {item.file}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 hidden sm:inline">
                    {item.category}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-900/90 text-xs space-y-2 text-slate-300">
                  <p className="leading-relaxed text-slate-300">
                    {item.detail}
                  </p>
                  {item.recommendation && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs">
                      <strong>Best Practice:</strong> {item.recommendation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
