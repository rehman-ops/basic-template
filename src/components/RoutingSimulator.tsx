import React, { useState } from 'react';
import { Globe, RefreshCw, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Code } from 'lucide-react';

interface RoutingSimulatorProps {
  repoName: string;
}

export const RoutingSimulator: React.FC<RoutingSimulatorProps> = ({ repoName }) => {
  const [currentRoute, setCurrentRoute] = useState('/deployments');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshLog, setRefreshLog] = useState<string | null>(null);
  const [hasSpaFallback, setHasSpaFallback] = useState(true);

  const cleanRepo = repoName || 'my-app';
  const fullUrl = `https://user.github.io/${cleanRepo}${currentRoute}`;

  const routes = [
    { path: '/', label: 'Home (/)' },
    { path: '/deployments', label: 'Deployments (/deployments)' },
    { path: '/analytics', label: 'Analytics (/analytics)' },
    { path: '/settings', label: 'Settings (/settings)' }
  ];

  const handleSimulateRefresh = () => {
    setIsRefreshing(true);
    setRefreshLog('Browser triggered hard refresh on: ' + fullUrl);

    setTimeout(() => {
      if (hasSpaFallback) {
        setRefreshLog(
          `1. GitHub Pages static server returned 404.html\n` +
          `2. 404.html script transformed URL into: https://user.github.io/${cleanRepo}/?/${currentRoute.slice(1)}\n` +
          `3. index.html script decoded query back to: ${fullUrl}\n` +
          `✓ Route restored seamlessly in React DOM with 0 broken state!`
        );
      } else {
        setRefreshLog(
          `1. GitHub Pages static server looked for physical file: ${cleanRepo}${currentRoute}.html\n` +
          `2. File not found in ./dist directory!\n` +
          `✗ ERROR: GitHub standard 404 "Page Not Found". User cannot reach the route.`
        );
      }
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Client-Side Routing & Subpath Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            SPA Routing & Subpath Sandbox
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Test how Vite handles subpath base paths and why the <code className="font-mono text-slate-300">public/404.html</code> trick is mandatory for client-side routing on GitHub Pages.
          </p>
        </div>
      </div>

      {/* Interactive Browser Address Bar Simulator */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Browser Header Bar */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          <button
            onClick={handleSimulateRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Simulate browser refresh on this deep route"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Address input */}
          <div className="flex-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono flex items-center gap-1.5 text-slate-400 select-all">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-500">https://</span>
            <span className="text-slate-300">user.github.io</span>
            <span className="text-emerald-400 font-semibold">/{cleanRepo}</span>
            <span className="text-cyan-300">{currentRoute}</span>
          </div>
        </div>

        {/* Browser Viewport */}
        <div className="p-6 space-y-6">
          {/* Route selector buttons */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-400">
              Select Client-Side Route to Test:
            </div>
            <div className="flex flex-wrap gap-2">
              {routes.map((r) => (
                <button
                  key={r.path}
                  onClick={() => {
                    setCurrentRoute(r.path);
                    setRefreshLog(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    currentRoute === r.path
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Simulation Trigger Card */}
          <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Test Deep Link Direct Refresh
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  See what happens if a visitor bookmarks or refreshes this non-root URL directly.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasSpaFallback}
                    onChange={(e) => setHasSpaFallback(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-0"
                  />
                  <span>Enable <code className="font-mono text-emerald-400 text-[11px]">404.html</code> fallback</span>
                </label>

                <button
                  onClick={handleSimulateRefresh}
                  disabled={isRefreshing}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  Simulate Refresh
                </button>
              </div>
            </div>

            {/* Simulation Log Result */}
            {refreshLog && (
              <div
                className={`p-3 rounded-lg border font-mono text-xs whitespace-pre-wrap leading-relaxed ${
                  hasSpaFallback
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}
              >
                {refreshLog}
              </div>
            )}
          </div>

          {/* Explanation Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-900/30 space-y-1.5">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Base Path in React Router</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When using <code className="font-mono text-slate-300">react-router-dom</code>, always pass the base URL so links know they live inside the subpath:
              </p>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 font-mono text-[11px] text-cyan-300">
                &lt;BrowserRouter basename=&#123;import.meta.env.BASE_URL&#125;&gt;
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800/80 bg-slate-900/30 space-y-1.5">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Installed in this Project</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We have pre-configured <code className="font-mono text-emerald-400">public/404.html</code> and the decoding script in <code className="font-mono text-emerald-400">index.html</code>. Your app is 100% immune to GitHub Pages 404 refresh bugs!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
