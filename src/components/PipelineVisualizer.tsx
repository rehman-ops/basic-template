import React, { useState } from 'react';
import { WorkflowStep } from '../types/workflow';
import { TerminalView } from './TerminalView';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Shield,
  Layers,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface PipelineVisualizerProps {
  steps: WorkflowStep[];
  onRunSimulation: () => void;
  onResetSimulation: () => void;
  isRunning: boolean;
  activeStepId: string | null;
  onSelectStep: (id: string) => void;
  repoName: string;
  simulateFailure: boolean;
  setSimulateFailure: (val: boolean) => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  steps,
  onRunSimulation,
  onResetSimulation,
  isRunning,
  activeStepId,
  onSelectStep,
  repoName,
  simulateFailure,
  setSimulateFailure
}) => {
  const currentStep = steps.find((s) => s.id === activeStepId) || steps[0];

  const completedSteps = steps.filter((s) => s.status === 'success').length;
  const isFailed = steps.some((s) => s.status === 'failed');
  const isAllSuccess = completedSteps === steps.length;
  const totalDuration = steps.reduce((acc, s) => acc + (s.status !== 'idle' ? s.durationMs : 0), 0);

  const deploymentUrl = `https://user.github.io/${repoName || 'my-app'}/`;

  return (
    <div className="space-y-6">
      {/* Run Metadata Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium text-slate-300">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                branch: <span className="font-mono text-emerald-400">main</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>event: <strong className="text-slate-300 font-mono">push</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>commit: <strong className="text-slate-300 font-mono">5a3f91e</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>runner: <strong className="text-slate-300">ubuntu-latest</strong></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>concurrency: <strong className="text-slate-300 font-mono">github-pages</strong></span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Build and Deploy to GitHub Pages</span>
              {isAllSuccess && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Passed
                </span>
              )}
              {isFailed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-md">
                  <XCircle className="w-3.5 h-3.5" />
                  Failed
                </span>
              )}
              {isRunning && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-md animate-pulse">
                  Running...
                </span>
              )}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/70 text-xs text-slate-300 cursor-pointer select-none hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 text-rose-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
              />
              <span className="flex items-center gap-1 text-slate-300">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                Simulate missing file error
              </span>
            </label>

            <button
              onClick={onResetSimulation}
              disabled={isRunning || steps.every((s) => s.status === 'idle')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>

            <button
              onClick={onRunSimulation}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Executing...' : 'Trigger Pipeline'}</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Step <strong>{completedSteps}</strong> of <strong>{steps.length}</strong> completed
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono tabular-nums">
              Total runtime: {(totalDuration / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="w-full sm:w-64 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFailed ? 'bg-rose-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${(completedSteps / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Steps List on Left, Terminal Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 9 Steps */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">
              Workflow Steps (9)
            </span>
            <span className="font-mono text-[11px]">jobs.build-and-deploy</span>
          </div>

          <div className="space-y-1.5">
            {steps.map((step) => {
              const isSelected = currentStep.id === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => onSelectStep(step.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/40 shadow-sm shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="mt-0.5 shrink-0">
                    {step.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {step.status === 'running' && (
                      <span className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin block" />
                    )}
                    {step.status === 'failed' && (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                    {step.status === 'idle' && (
                      <span className="w-4 h-4 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        {step.number}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {step.number}. {step.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 tabular-nums shrink-0">
                        {step.status === 'success' || step.status === 'failed'
                          ? `${(step.durationMs / 1000).toFixed(1)}s`
                          : step.status === 'running'
                          ? 'running'
                          : ''}
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {step.type === 'action' ? `uses: ${step.actionOrCommand}` : `run: ${step.actionOrCommand}`}
                    </p>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 mt-0.5 shrink-0 transition-transform ${
                      isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step Inspector & Live Console */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step Detail Card */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="uppercase tracking-wider font-semibold text-[10px] text-emerald-400">
                    Step {currentStep.number} of {steps.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Type: <strong className="font-mono text-slate-300">{currentStep.type}</strong></span>
                  {currentStep.durationMs > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        {(currentStep.durationMs / 1000).toFixed(2)}s runtime
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-base font-semibold text-white mt-1">
                  {currentStep.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentStep.description}
                </p>
              </div>

              <div className="shrink-0">
                {currentStep.status === 'success' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed
                  </span>
                )}
                {currentStep.status === 'running' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md animate-pulse">
                    Executing...
                  </span>
                )}
                {currentStep.status === 'failed' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-md">
                    <XCircle className="w-3.5 h-3.5" />
                    Failed
                  </span>
                )}
                {currentStep.status === 'idle' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 bg-slate-800/60 rounded-md">
                    Queued
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400 mb-1 font-medium">Command / Action Invocation:</div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 break-all select-all">
                {currentStep.type === 'action' ? (
                  <span className="text-cyan-400">uses: {currentStep.actionOrCommand}</span>
                ) : (
                  <span className="text-emerald-400">$ {currentStep.actionOrCommand}</span>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Logs */}
          <TerminalView
            logs={currentStep.logs}
            stepName={`Step ${currentStep.number}: ${currentStep.name}`}
            status={currentStep.status}
            durationMs={currentStep.durationMs}
          />
        </div>
      </div>

      {/* Deployment Success Banner (When finished) */}
      {isAllSuccess && (
        <div className="p-4 sm:p-5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>GitHub Pages Deployment Completed Successfully</span>
            </div>
            <p className="text-xs text-slate-300">
              Artifact unpacked and served from edge cache. Environment URL published:
            </p>
            <a
              href={deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-emerald-300 hover:text-emerald-200 underline underline-offset-4 font-semibold"
            >
              <span>{deploymentUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(deploymentUrl);
                alert('Copied deployment URL to clipboard!');
              }}
              className="px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors whitespace-nowrap"
            >
              Copy URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
