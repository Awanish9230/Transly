import { motion } from "framer-motion";

function HeroSection({ scrollToMeetings, scrollToUploader }) {
  return (
    <section className="relative bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white min-h-screen flex items-center overflow-hidden">
      {/* 🌀 Animated Background Lights */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.35, 0.25] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-10 left-16 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute bottom-20 right-16 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-[120px]"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-16 w-full">
        {/* 🧠 Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="md:w-1/2 text-center md:text-left space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight"
          >
            Empower Your Meetings with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              AI-Driven Summaries 🎤
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 leading-relaxed"
          >
            Transform long discussions into meaningful insights. Let AI capture
            action items, key points, and decisions — giving you the clarity and
            focus you deserve.
          </motion.p>

          {/* 🎯 Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToMeetings}
              className="group bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/40 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              📋 <span className="group-hover:pl-1 transition-all">View Your Meetings</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToUploader}
              className="group border border-cyan-400 text-cyan-300 px-8 py-3 rounded-xl font-semibold hover:bg-cyan-400/10 hover:text-white transition-all focus:outline-none focus:ring-4 focus:ring-cyan-400/30"
            >
              ⬆️ <span className="group-hover:pl-1 transition-all">Upload Audio/Video</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 🎬 Right Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          className="md:w-1/2 flex justify-center relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative group"
          >
            <img
              src="/zoomMeeting.jpg"
              alt="AI Meeting Illustration"
              className="w-full max-w-lg rounded-3xl shadow-2xl shadow-indigo-900/40 border border-gray-700 transition-transform transform group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/40 to-transparent"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* 🌌 Subtle Floating Glows */}
      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1], y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute top-1/3 left-1/4 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl"
      ></motion.div>

      <motion.div
        animate={{ opacity: [0.1, 0.2, 0.1], y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
        className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-purple-600 rounded-full opacity-10 blur-3xl"
      ></motion.div>
    </section>
  );
}

export default HeroSection;
