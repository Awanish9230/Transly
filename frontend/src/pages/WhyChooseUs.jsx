import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const features = [
    { title: "AI-Powered Summaries", desc: "Generate concise and accurate meeting summaries instantly." },
    { title: "Action Item Detection", desc: "Automatically identify key decisions and follow-up tasks." },
    { title: "Secure Cloud Storage", desc: "All meeting data encrypted and safely stored." },
    { title: "Collaboration Friendly", desc: "Easily share summaries and action items with your team." },
  ];

  return (
    <motion.div
      className="pt-28 px-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-center mb-10">Why Choose Us?</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800/70 p-6 rounded-2xl shadow-lg border border-gray-700/40"
          >
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">{f.title}</h2>
            <p className="text-gray-300">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
