import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AudioUploader from "../components/AudioUploader";
import MeetingList from "../components/MeetingList";
import PromoBanner from "../components/PromoBanner";

function Dashboard({ user, setUser }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const uploadRef = useRef(null);
  const meetingsRef = useRef(null);

  // 📡 Fetch meetings
  const fetchMeetings = async () => {
    try {
      const { data } = await api.get("/meetings");
      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-refresh every 10s
  useEffect(() => {
    fetchMeetings();
    const interval = setInterval(fetchMeetings, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Count completed meetings dynamically
  const completedMeetings = meetings.filter(
    (m) => m.status === "completed"
  ).length;

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // 🔽 Smooth scroll helpers
  const scrollToUploader = () =>
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMeetings = () =>
    meetingsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 flex flex-col relative">
      {/* 🔝 Promo Banner */}
      <PromoBanner
        message="🔥 Exclusive Offer! Get lifetime AI Meeting Summaries access at 60% OFF — Limited Time Only!"
        gradient="from-indigo-600 via-purple-600 to-pink-600"
      />

      {/* 🧭 Header — dynamically shows completed meetings */}
      <Header
        user={user}
        completedMeetings={completedMeetings}
        onLogout={handleLogout}
      />

      {/* 🏗️ Offset for fixed header + banner */}
      <div className="pt-[90px] sm:pt-[100px]">
        {/* 💡 Hero Section */}
        <HeroSection
          scrollToMeetings={scrollToMeetings}
          scrollToUploader={scrollToUploader}
        />

        {/* 🎙️ Upload Section */}
        <section
          ref={uploadRef}
          className="scroll-mt-24 bg-gradient-to-tr from-indigo-50 via-slate-50 to-purple-100 shadow-2xl rounded-3xl mx-auto max-w-5xl px-8 py-12 mt-16 border border-indigo-100 backdrop-blur-sm"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
            🎧 Upload Your Meeting Recording
          </h2>
          <p className="text-gray-700 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your meeting audio or video and get instant AI-powered
            summaries, highlights, and action items — all beautifully organized
            and searchable.
          </p>

          <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-300">
            <AudioUploader onUploadSuccess={fetchMeetings} />
          </div>
        </section>

        {/* 📜 Meetings Section */}
        <section
          ref={meetingsRef}
          className="scroll-mt-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 mx-auto max-w-7xl rounded-3xl mt-20 sm:mt-24 px-8 py-14 shadow-2xl border border-slate-200 backdrop-blur-sm"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              🗂️ Your Meetings
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Browse through your processed meetings — explore smart summaries,
              AI-generated insights, and key takeaways for every session.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition duration-300">
            <MeetingList
              meetings={meetings}
              loading={loading}
              navigate={navigate}
            />
          </div>
        </section>

        {/* Footer Padding for Balance */}
        <div className="h-20" />
      </div>
    </div>
  );
}

export default Dashboard;
