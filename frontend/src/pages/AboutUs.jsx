import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function AboutUs({ user }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex flex-col">
      {/* 🧭 Header */}
      <Header
        user={user}
        onHome={() => navigate("/")}
        onAbout={() => navigate("/about")}
        onSignIn={() => navigate("/login")}
        onSignUp={() => navigate("/signup")}
      />

      <main className="pt-[100px] px-6 flex-grow max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-center">
          About Transly
        </h1>
        <p className="text-gray-300 leading-relaxed text-lg text-center mb-6">
          Transly helps you summarize meetings, videos, and audio recordings with
          AI-powered transcription and actionable insights. Whether you’re
          capturing key decisions, tracking progress, or extracting summaries,
          Transly makes it effortless and intelligent.
        </p>

        <p className="text-gray-400 text-center max-w-3xl mx-auto">
          Built with the latest AI technology, Transly turns hours of content into
          concise, searchable insights — empowering teams and professionals to
          focus on action, not note-taking.
        </p>
      </main>
    </div>
  );
}

export default AboutUs;
