import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-eo-bg">
      <div className="text-center px-6">
        <div className="eo-eyebrow mb-4">Error</div>
        <h1 className="font-display text-7xl font-semibold text-eo-ink mb-4 tracking-tight">404</h1>
        <p className="text-eo-dim mb-8 font-light">页面未找到 / Page Not Found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-sm text-eo-dim hover:text-eo-ink transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/60"
        >
          返回首页 →
        </Link>
      </div>
    </main>
  );
}
