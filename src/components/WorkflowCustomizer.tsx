import React, { useState, useMemo } from 'react';
import { WorkflowConfig } from '../types/workflow';
import { Copy, Check, Download, Sliders, FileCode, CheckCircle2 } from 'lucide-react';

interface WorkflowCustomizerProps {
  config: WorkflowConfig;
  onChangeConfig: (newConfig: WorkflowConfig) => void;
  onCopyYaml: (text: string) => void;
}

export const WorkflowCustomizer: React.FC<WorkflowCustomizerProps> = ({
  config,
  onChangeConfig,
  onCopyYaml
}) => {
  const [copied, setCopied] = useState(false);

  // Generate dynamic YAML based on config
  const generatedYaml = useMemo(() => {
    const isPnpm = config.packageManager === 'pnpm';
    const isYarn = config.packageManager === 'yarn';
    const isBun = config.packageManager === 'bun';

    let installCmd = 'if [ -f package-lock.json ]; then\n            npm ci\n          else\n            npm install --legacy-peer-deps\n          fi';
    let buildCmd = 'npm run build -- --base=/${{ github.event.repository.name }}/';
    let lintCmd = 'npm run lint';

    if (isPnpm) {
      installCmd = 'pnpm install --frozen-lockfile';
      buildCmd = 'pnpm run build -- --base=/${{ github.event.repository.name }}/';
      lintCmd = 'pnpm run lint';
    } else if (isYarn) {
      installCmd = 'yarn install --frozen-lockfile';
      buildCmd = 'yarn build -- --base=/${{ github.event.repository.name }}/';
      lintCmd = 'yarn lint';
    } else if (isBun) {
      installCmd = 'bun install --frozen-lockfile';
      buildCmd = 'bun run build -- --base=/${{ github.event.repository.name }}/';
      lintCmd = 'bun run lint';
    }

    if (config.baseStrategy === 'root') {
      buildCmd = config.packageManager === 'npm' ? 'npm run build' : `${config.packageManager} run build`;
    } else if (config.baseStrategy === 'custom' && config.customBase) {
      buildCmd = `${config.packageManager === 'npm' ? 'npm run build --' : config.packageManager + ' run build --'} --base=${config.customBase}`;
    }

    return `name: Build and Deploy to GitHub Pages

on:
  push:
    branches:
      - ${config.branchName || 'main'}
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}

    steps:
      # 1. Get project files
      - name: Checkout repository
        uses: actions/checkout@v4
${
  isPnpm
    ? `
      # 1.5. Setup pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9
`
    : ''
}
      # 2. Install Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${config.nodeVersion || 'lts/*'}
          cache: '${config.packageManager === 'bun' ? '' : config.packageManager}'

      # 3. Check project structure
      - name: Check project structure
        run: |
          echo "Checking project..."

          test -f package.json || {
            echo "ERROR: package.json not found."
            exit 1
          }

          test -f index.html || {
            echo "ERROR: index.html not found."
            exit 1
          }

          test -f src/main.tsx || {
            echo "ERROR: src/main.tsx not found."
            exit 1
          }

          echo "Project structure looks good."

      # 4. Install dependencies
      - name: Install dependencies
        run: |
          ${installCmd}
${
  config.includeLintStep
    ? `
      # 4.5. Run Code Quality & Lint
      - name: Lint codebase
        run: |
          ${lintCmd}
`
    : ''
}
      # 5. Build project
      - name: Build website
        run: |
          ${buildCmd}
${
  config.customDomain
    ? `
      # 5.5. Configure Custom Domain CNAME
      - name: Create CNAME file
        run: |
          echo "${config.customDomain}" > dist/CNAME
`
    : ''
}${
      config.includeSpa404Step
        ? `
      # 5.6. Ensure SPA 404 Routing Fallback
      - name: Copy 404 fallback
        run: |
          if [ -f public/404.html ]; then
            cp public/404.html dist/404.html
          elif [ -f dist/index.html ]; then
            cp dist/index.html dist/404.html
          fi
`
        : ''
    }
      # 6. Verify build
      - name: Verify production build
        run: |
          test -d dist || {
            echo "ERROR: dist folder was not created."
            exit 1
          }

          echo "Production build successful."
          echo "Files generated:"
          find dist -maxdepth 2 -type f | head -30

      # 7. Configure GitHub Pages
      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5

      # 8. Upload production files
      - name: Upload website
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

      # 9. Deploy
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;
  }, [config]);

  const handleCopy = () => {
    onCopyYaml(generatedYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = generatedYaml.split('\n');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Interactive Workflow Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Configure .github/workflows/deploy.yml
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tailor branch triggers, base routing, package managers, and domain parameters with immediate preview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download deploy.yml</span>
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy YAML</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">
            Workflow Parameters
          </h3>

          {/* Target Branch */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Git Deployment Branch
            </label>
            <input
              type="text"
              value={config.branchName}
              onChange={(e) => onChangeConfig({ ...config, branchName: e.target.value })}
              placeholder="main"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <span className="text-[11px] text-slate-500">
              Triggered automatically on push to this branch
            </span>
          </div>

          {/* Package Manager */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Package Manager
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['npm', 'pnpm', 'yarn', 'bun'] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => onChangeConfig({ ...config, packageManager: pm })}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    config.packageManager === pm
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Node.js Version */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Node.js Version
            </label>
            <select
              value={config.nodeVersion}
              onChange={(e) => onChangeConfig({ ...config, nodeVersion: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="lts/*">lts/* (Recommended)</option>
              <option value="22.x">22.x (Current)</option>
              <option value="20.x">20.x (Active LTS)</option>
              <option value="18.x">18.x (Maintenance)</option>
            </select>
          </div>

          {/* Base Path Strategy */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Base URL Strategy
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="baseStrategy"
                  checked={config.baseStrategy === 'repo'}
                  onChange={() => onChangeConfig({ ...config, baseStrategy: 'repo' })}
                  className="text-emerald-500 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <span>Repository Subpath: <code className="font-mono text-emerald-400 text-[11px]">/${'{github.event.repository.name}'}/</code></span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="baseStrategy"
                  checked={config.baseStrategy === 'root'}
                  onChange={() => onChangeConfig({ ...config, baseStrategy: 'root' })}
                  className="text-emerald-500 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <span>Root Domain: <code className="font-mono text-slate-400 text-[11px]">/</code> (User/Org Pages or Custom Domain)</span>
              </label>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium text-slate-300 block">
              Custom Domain (Optional CNAME)
            </label>
            <input
              type="text"
              value={config.customDomain}
              onChange={(e) => onChangeConfig({ ...config, customDomain: e.target.value })}
              placeholder="app.example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <span className="text-[11px] text-slate-500">
              Leaves empty if using standard <code className="font-mono">username.github.io/repo</code>
            </span>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeLintStep}
                onChange={(e) => onChangeConfig({ ...config, includeLintStep: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-0"
              />
              <span>Add pre-build lint verification (<code className="font-mono text-[11px]">npm run lint</code>)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={config.includeSpa404Step}
                onChange={(e) => onChangeConfig({ ...config, includeSpa404Step: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-0"
              />
              <span>Inject SPA 404 fallback copy to <code className="font-mono text-[11px]">dist/404.html</code></span>
            </label>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-slate-300">.github/workflows/deploy.yml</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {lines.length} lines · YAML
            </span>
          </div>

          <div className="p-3.5 font-mono text-xs overflow-x-auto max-h-[560px] overflow-y-auto bg-slate-950/95 leading-relaxed">
            {lines.map((line, idx) => {
              const isComment = line.trim().startsWith('#');
              const isKey = line.includes(':') && !isComment;
              const isUses = line.includes('uses:');
              const isRun = line.includes('run:');

              return (
                <div key={idx} className="flex items-start gap-3 group hover:bg-slate-900/40 px-1 rounded">
                  <span className="text-slate-600 select-none text-[11px] w-6 shrink-0 text-right tabular-nums group-hover:text-slate-500">
                    {idx + 1}
                  </span>
                  <span
                    className={`whitespace-pre ${
                      isComment
                        ? 'text-slate-500 italic'
                        : isUses
                        ? 'text-cyan-300'
                        : isRun
                        ? 'text-amber-300'
                        : isKey
                        ? 'text-emerald-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
