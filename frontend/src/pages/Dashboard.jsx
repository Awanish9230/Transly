import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AudioUploader from "../components/AudioUploader";
import MeetingList from "../components/MeetingList";

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

  const completedMeetings = meetings.filter(
    (m) => m.status === "completed"
  ).length;

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const scrollToUploader = () =>
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMeetings = () =>
    meetingsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex flex-col relative text-gray-100 transition-all duration-500">
      {/* 🧭 Header */}
      <Header
        user={user}
        completedMeetings={completedMeetings}
        onLogout={handleLogout}
      />

      <div className="pt-[90px] sm:pt-[100px]">
        {/* 🌌 Hero Section */}
        <HeroSection
          scrollToMeetings={scrollToMeetings}
          scrollToUploader={scrollToUploader}
        />

        {/* 🎙️ Upload Section */}
        <section
          ref={uploadRef}
          className="scroll-mt-24 bg-gradient-to-tr from-gray-900/90 via-gray-800/90 to-gray-900/80 shadow-2xl rounded-3xl mx-auto max-w-5xl px-8 py-10 mt-20 sm:mt-28 border border-indigo-700/40 backdrop-blur-md hover:border-indigo-500/50 transition duration-500"

        >
          <h2 className="text-3xl font-extrabold text-center mb-3 text-white">
            🎧 Upload Your Meeting Recording
          </h2>
          <p className="text-gray-300 text-center mb-6 max-w-2xl mx-auto leading-relaxed">
            Upload your meeting audio or video and get instant AI-powered
            summaries, highlights, and action items — all beautifully organized
            and searchable.
          </p>

          <div className="bg-gray-800/60 backdrop-blur-md border border-indigo-600/30 rounded-2xl p-4 shadow-lg hover:shadow-indigo-700/30 transition duration-300">
            <AudioUploader onUploadSuccess={fetchMeetings} />
          </div>
        </section>



        {/* 📜 Meetings Section */}
        <section
          ref={meetingsRef}
          className="scroll-mt-24 bg-gradient-to-b from-gray-900/90 via-gray-950/90 to-black/80 mx-auto max-w-7xl rounded-3xl mt-20 sm:mt-24 px-8 py-14 shadow-2xl border border-gray-700/40 backdrop-blur-md"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white">
              🗂️ Your Meetings
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Browse through your processed meetings — explore smart summaries,
              AI-generated insights, and key takeaways for every session.
            </p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/40 p-6 shadow-lg hover:shadow-indigo-700/30 transition duration-300">
            <MeetingList
              meetings={meetings}
              loading={loading}
              navigate={navigate}
            />
          </div>
        </section>

        {/* Footer Spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
}

export default Dashboard;
