function HeroSection({ scrollToMeetings, scrollToUploader }) {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12 w-full">
        {/* 🧠 Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Transform Your Meetings with <br />
            <span className="text-yellow-300">AI-Powered Insights 🎤</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100">
            Let our AI summarize your recordings, extract key tasks, and give you actionable insights —
            so you can focus on what really matters.
          </p>

          {/* ✅ Working Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <button
              onClick={scrollToMeetings}
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-100 transition-transform hover:scale-105"
            >
              📋 View Your Meetings
            </button>

            <button
              onClick={scrollToUploader}
              className="bg-transparent border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-transform hover:scale-105"
            >
              ⬆️ Upload Meeting Audio/Video
            </button>
          </div>
        </div>

        {/* 🎬 Right Illustration */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/zoomMeeting.jpg"
            alt="AI Meeting Illustration"
            className="w-full max-w-lg rounded-2xl shadow-2xl"
          />
        </div>
      </div>

      {/* ✨ Decorative Background Blurs */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
    </section>
  );
}

export default HeroSection;
