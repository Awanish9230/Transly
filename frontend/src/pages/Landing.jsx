import { Link, useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎤 Meeting AI</h1>
        <nav className="space-x-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium ml-2">Get Started</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Summarize meetings. Extract action items. 100% local & private.</h2>
          <p className="mt-4 text-lg opacity-90">Upload audio or video recordings. Get transcripts, summaries, tasks, and shareable reports—all without sending data to the cloud.</p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => navigate('/signup')} className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg">Start Free</button>
            <button onClick={() => navigate('/login')} className="bg-indigo-500/40 backdrop-blur px-6 py-3 rounded-lg font-semibold border border-white/30">Login</button>
          </div>
          <ul className="mt-8 space-y-2 text-sm opacity-90">
            <li>• Offline Whisper STT + BART summarization</li>
            <li>• Extracts tasks, deadlines, and assignees</li>
            <li>• Export PDF and share read-only links</li>
            <li>• Privacy-first, open-source stack</li>
          </ul>
        </div>
        <div className="bg-white/10 rounded-xl p-6 shadow-xl border border-white/20">
          <div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center text-white/70">Preview</div>
          <p className="mt-4 text-sm opacity-80">Live meeting mode (beta) and calendar integrations coming soon.</p>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-6 text-white/80 text-sm">
        © {new Date().getFullYear()} Meeting AI. All rights reserved.
      </footer>
    </div>
  );
}

export default Landing;
