import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  GitBranch,
  Shield,
  Layers,
  Terminal,
  Settings,
  HelpCircle
} from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Official GitHub Pages Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Deployment Setup & Best Practices
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Modern GitHub Pages uses first-party GitHub Actions (no orphan <code className="font-mono text-slate-300">gh-pages</code> branch or Personal Access Token required).
          </p>
        </div>
      </div>

      {/* 4 Step Visual Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-mono">1</span>
            <span>Switch Source to GitHub Actions</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In your GitHub repository, navigate to <strong>Settings</strong> &gt; <strong>Pages</strong>. Under <strong>Build and deployment &gt; Source</strong>, choose <strong>GitHub Actions</strong>.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400">
            Repository &gt; Settings &gt; Pages &gt; Source: GitHub Actions
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-mono">2</span>
            <span>Commit the Workflow File</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ensure <code className="font-mono text-slate-300">.github/workflows/deploy.yml</code> is committed to your repository's <code className="font-mono text-slate-300">main</code> branch.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
            git add .github/workflows/deploy.yml<br />
            git commit -m "ci: add GitHub Pages workflow"<br />
            git push origin main
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-mono">3</span>
            <span>Automatic & Manual Trigger</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The workflow fires on every git push to <code className="font-mono text-slate-300">main</code>. Because <code className="font-mono text-slate-300">workflow_dispatch</code> is included, you can also trigger manual deployments from the <strong>Actions</strong> tab.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400">
            Actions &gt; "Build and Deploy to GitHub Pages" &gt; Run workflow
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-mono">4</span>
            <span>Verify Live Production URL</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Once step 9 (<code className="font-mono text-slate-300">deploy-pages</code>) finishes, GitHub will output the live site link directly in the action run summary.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400">
            https://&lt;username&gt;.github.io/&lt;repo-name&gt;/
          </div>
        </div>
      </div>

      {/* Troubleshooting Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Troubleshooting Common Issues</span>
        </h3>

        <div className="space-y-3">
          {/* Issue 1 */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/80 space-y-1.5">
            <div className="text-xs font-semibold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Blank White Screen or 404 on CSS/JS Assets</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Cause:</strong> Vite defaults to root path <code className="font-mono text-slate-200">/</code>, but GitHub project sites live under a subpath <code className="font-mono text-slate-200">/repository-name/</code>.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Solution:</strong> The workflow already fixes this automatically via step 5: <code className="font-mono text-emerald-400">npm run build -- --base=/${'{github.event.repository.name}'}/</code>. Also verify you do not use hardcoded absolute paths like <code className="font-mono text-slate-300">&lt;img src="/logo.png"&gt;</code> in code; import assets instead.
            </p>
          </div>

          {/* Issue 2 */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/80 space-y-1.5">
            <div className="text-xs font-semibold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>404 "File Not Found" When Refreshing Client Routes (React Router)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Cause:</strong> GitHub Pages is a static file host. If a user refreshes <code className="font-mono text-slate-200">/my-repo/about</code>, GitHub checks for an actual file named <code className="font-mono text-slate-200">about.html</code> and returns a 404.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Solution:</strong> This project includes <code className="font-mono text-emerald-400">public/404.html</code> and an index.html decoder. When a deep link 404 occurs, GitHub loads the 404.html script, which rewrites the URL to a query and redirects to index.html without breaking browser history!
            </p>
          </div>

          {/* Issue 3 */}
          <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950/80 space-y-1.5">
            <div className="text-xs font-semibold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Permission Denied: Unable to create deployment</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Cause:</strong> Missing workflow permissions or repository settings restricting GitHub Actions.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Solution:</strong> Verify your workflow includes the top-level <code className="font-mono text-slate-300">permissions: pages: write, id-token: write, contents: read</code> block. In repo <strong>Settings &gt; Actions &gt; General</strong>, ensure "Workflow permissions" is set to allow write tokens if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
