import { WorkflowStep, HealthCheckItem } from '../types/workflow';

export const RAW_DEPLOY_WORKFLOW = `name: Build and Deploy to GitHub Pages

on:
  push:
    branches:
      - main
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

      # 2. Install Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: lts/*

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
          if [ -f package-lock.json ]; then
            npm ci
          else
            npm install --legacy-peer-deps
          fi

      # 5. Build project
      - name: Build website
        run: |
          npm run build -- --base=/\${{ github.event.repository.name }}/

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

export const INITIAL_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'checkout',
    number: 1,
    name: 'Checkout repository',
    type: 'action',
    actionOrCommand: 'actions/checkout@v4',
    description: 'Retrieves source code from GitHub repository with clean commit history',
    durationMs: 720,
    status: 'idle',
    logs: [
      'Syncing repository: user/project-pages',
      'Getting Git version info',
      'Working directory is "/home/runner/work/project-pages/project-pages"',
      '/usr/bin/git version',
      'git version 2.43.0',
      'Initializing repository',
      'Fetching the repository',
      'Determining the checkout info',
      'Checking out 5a3f91e (refs/heads/main)',
      'Successfully checked out commit 5a3f91e'
    ]
  },
  {
    id: 'setup-node',
    number: 2,
    name: 'Setup Node.js',
    type: 'action',
    actionOrCommand: 'actions/setup-node@v4 (node-version: lts/*)',
    description: 'Provisions the LTS Node.js runtime and registers npm executable on system PATH',
    durationMs: 950,
    status: 'idle',
    logs: [
      'Resolving node version spec: lts/*',
      'Found in cache: node v22.14.0',
      'Environment variable NODE_VERSION set to 22.14.0',
      'Adding /opt/hostedtoolcache/node/22.14.0/x64/bin to PATH',
      '/usr/local/bin/node -v => v22.14.0',
      '/usr/local/bin/npm -v => 10.9.2'
    ]
  },
  {
    id: 'check-structure',
    number: 3,
    name: 'Check project structure',
    type: 'run',
    actionOrCommand: 'test -f package.json && test -f index.html && test -f src/main.tsx',
    description: 'Validates critical files needed for Vite React bundle generation before building',
    durationMs: 310,
    status: 'idle',
    logs: [
      'Checking project...',
      'Verifying package.json existence... OK',
      'Verifying index.html existence... OK',
      'Verifying src/main.tsx existence... OK',
      'Project structure looks good.'
    ]
  },
  {
    id: 'install-deps',
    number: 4,
    name: 'Install dependencies',
    type: 'run',
    actionOrCommand: 'if [ -f package-lock.json ]; then npm ci; else npm install --legacy-peer-deps; fi',
    description: 'Installs production and development node modules deterministically',
    durationMs: 2400,
    status: 'idle',
    logs: [
      'Evaluating package lockfile existence...',
      'Executing: npm install --legacy-peer-deps',
      'added 86 packages in 2.38s',
      '14 packages are looking for funding',
      '  run `npm fund` for details',
      'Node modules directory resolved: 86 packages verified'
    ]
  },
  {
    id: 'build-site',
    number: 5,
    name: 'Build website',
    type: 'run',
    actionOrCommand: 'npm run build -- --base=/${{ github.event.repository.name }}/',
    description: 'Executes Vite production build with GitHub Pages repository subpath base routing',
    durationMs: 1850,
    status: 'idle',
    logs: [
      '> react-example@0.0.0 build',
      '> vite build --base=/react-pages-demo/',
      'vite v8.3.0 building for production...',
      'transforming (24) modules...',
      'rendering chunks...',
      'computing gzip size...',
      'dist/index.html                   1.42 kB │ gzip:  0.64 kB',
      'dist/assets/index-C8xNqL.css      4.81 kB │ gzip:  1.62 kB',
      'dist/assets/index-Bf9k8z.js     172.94 kB │ gzip: 54.12 kB',
      '✓ built in 1.48s'
    ]
  },
  {
    id: 'verify-build',
    number: 6,
    name: 'Verify production build',
    type: 'run',
    actionOrCommand: 'test -d dist && find dist -maxdepth 2 -type f | head -30',
    description: 'Confirms dist/ artifact creation and enumerates output asset files',
    durationMs: 240,
    status: 'idle',
    logs: [
      'Testing directory: dist/',
      'Production build successful.',
      'Files generated:',
      'dist/index.html',
      'dist/404.html',
      'dist/assets/index-C8xNqL.css',
      'dist/assets/index-Bf9k8z.js',
      'All 4 output artifacts verified with non-zero byte length.'
    ]
  },
  {
    id: 'configure-pages',
    number: 7,
    name: 'Configure GitHub Pages',
    type: 'action',
    actionOrCommand: 'actions/configure-pages@v5',
    description: 'Negotiates deployment metadata, environment tokens, and GitHub Pages host URLs',
    durationMs: 620,
    status: 'idle',
    logs: [
      'Fetching GitHub Pages configuration for repository user/project-pages',
      'Target deployment URL: https://user.github.io/project-pages/',
      'Configuring OpenID Connect (OIDC) token exchange...',
      'GitHub Pages token exchange successful',
      'Base URL configured to /project-pages/'
    ]
  },
  {
    id: 'upload-artifact',
    number: 8,
    name: 'Upload production files',
    type: 'action',
    actionOrCommand: 'actions/upload-pages-artifact@v3 (path: ./dist)',
    description: 'Packages and tars ./dist files to securely upload artifact to GitHub Pages backend',
    durationMs: 1100,
    status: 'idle',
    logs: [
      'Creating tarball of: /home/runner/work/project-pages/project-pages/dist',
      'Scanning dist folder for web assets...',
      'Tarring 4 files (approx. 182 kB uncompressed)',
      'Uploading artifact "github-pages" via streaming multipart upload...',
      'Upload complete: artifact id 98124803',
      'Artifact URL: https://actions.github.com/artifact/98124803'
    ]
  },
  {
    id: 'deploy-pages',
    number: 9,
    name: 'Deploy to GitHub Pages',
    type: 'action',
    actionOrCommand: 'actions/deploy-pages@v4 (id: deployment)',
    description: 'Publishes artifact to GitHub CDN infrastructure and assigns public live URL',
    durationMs: 1400,
    status: 'idle',
    logs: [
      'Executing deployment against GitHub Pages CDN cluster...',
      'Environment: github-pages',
      'Validating artifact hash & OIDC signatures',
      'Deploying artifact 98124803 to edge locations',
      'Routing traffic for https://user.github.io/project-pages/',
      'Deployment created with ID: 4189024',
      'Successfully deployed to: https://user.github.io/project-pages/'
    ]
  }
];

export const INITIAL_HEALTH_CHECKS: HealthCheckItem[] = [
  {
    id: 'check-pkg',
    title: 'package.json Configuration',
    category: 'structure',
    status: 'passed',
    message: 'Root package.json exists with required scripts',
    detail: 'Build script "vite build" is configured and ready to accept the --base argument from GitHub Actions.',
    file: 'package.json'
  },
  {
    id: 'check-entry',
    title: 'HTML & TypeScript Entrypoints',
    category: 'structure',
    status: 'passed',
    message: 'index.html and src/main.tsx exist and align with workflow test assertions',
    detail: 'Step 3 run assertion (`test -f index.html && test -f src/main.tsx`) will pass with exit code 0.',
    file: 'index.html'
  },
  {
    id: 'check-workflow-file',
    title: 'Workflow File Location',
    category: 'github',
    status: 'passed',
    message: '.github/workflows/deploy.yml is registered in repository',
    detail: 'GitHub Actions automatically identifies workflows committed under the .github/workflows directory.',
    file: '.github/workflows/deploy.yml'
  },
  {
    id: 'check-base-handling',
    title: 'Subpath Base Handling',
    category: 'config',
    status: 'passed',
    message: 'Vite CLI accepts --base=/<repo>/ override',
    detail: 'When passing -- --base=/${{ github.event.repository.name }}/, all bundled assets (.js, .css, images) prepend the repository name.',
    recommendation: 'Ensure asset paths in React use relative URLs or import statements rather than root-absolute /assets/...'
  },
  {
    id: 'check-spa-404',
    title: 'SPA Direct Refresh (404 Fallback)',
    category: 'config',
    status: 'passed',
    message: 'public/404.html redirection is installed in project',
    detail: 'GitHub Pages returns a default 404 on deep links like /about or /dashboard. The included 404 handler preserves URLs and redirects smoothly.',
    file: 'public/404.html'
  },
  {
    id: 'check-permissions',
    title: 'Actions Security Permissions',
    category: 'github',
    status: 'passed',
    message: 'OIDC id-token: write and pages: write declared in workflow',
    detail: 'Modern GitHub Pages deployments bypass personal access tokens (PAT) in favor of short-lived OIDC tokens via id-token: write.',
    file: '.github/workflows/deploy.yml'
  }
];
