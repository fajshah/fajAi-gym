import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 max-w-md w-full space-y-4">
        <h2 className="text-3xl font-bold text-emerald-400">404</h2>
        <p className="text-lg font-semibold text-slate-200">Page Not Found</p>
        <p className="text-sm text-slate-400">
          The requested health dashboard view does not exist.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
