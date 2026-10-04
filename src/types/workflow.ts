export interface WorkflowStep {
  id: string;
  number: number;
  name: string;
  type: 'action' | 'run';
  actionOrCommand: string;
  description: string;
  durationMs: number;
  status: 'idle' | 'running' | 'success' | 'failed' | 'skipped';
  logs: string[];
}

export interface HealthCheckItem {
  id: string;
  title: string;
  category: 'structure' | 'config' | 'scripts' | 'github';
  status: 'passed' | 'warning' | 'failed';
  message: string;
  detail: string;
  file?: string;
  recommendation?: string;
}

export interface WorkflowConfig {
  repoName: string;
  branchName: string;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  nodeVersion: string;
  includeLintStep: boolean;
  includeSpa404Step: boolean;
  customDomain: string;
  baseStrategy: 'repo' | 'root' | 'custom';
  customBase: string;
}
