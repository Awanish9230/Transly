import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import { motion } from "framer-motion";

function PublicReport() {
  const { token } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/public/meetings/${token}`
        );
        setMeeting(data);
      } catch (e) {
        setMeeting(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [token]);

  const exportToPDF = () => {
    if (!meeting) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    doc.setFontSize(18);
    doc.text(meeting.title, margin, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Date: ${new Date(meeting.createdAt).toLocaleString()}`, margin, y);
    y += 15;

    doc.setFontSize(14);
    doc.text("Summary", margin, y);
    y += 7;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(
      meeting.summary || "No summary available",
      pageWidth - 2 * margin
    );
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 10;

    if (meeting.tasks && meeting.tasks.length > 0) {
      doc.setFontSize(14);
      doc.text("Action Items", margin, y);
      y += 7;
      doc.setFontSize(10);
      meeting.tasks.forEach((task, i) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${i + 1}. ${task.description}`, margin, y);
        y += 5;
        doc.text(
          `   Assigned: ${task.assignedTo} | Deadline: ${task.deadline} | Priority: ${task.priority}`,
          margin,
          y
        );
        y += 8;
      });
    }

    if (meeting.transcript) {
      doc.addPage();
      y = 20;
      doc.setFontSize(14);
      doc.text("Full Transcript", margin, y);
      y += 7;
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(
        meeting.transcript,
        pageWidth - 2 * margin
      );
      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 5;
      });
    }

    doc.save(`${meeting.title}.pdf`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-gray-300">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4">Loading report...</p>
        </div>
      </div>
    );

  if (!meeting)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-gradient-to-b from-gray-900 to-black">
        Invalid or unavailable report.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 pt-[140px]">


      {/* 🔹 Fixed Header */}
      <header className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700 shadow-md">

        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            {meeting.title}
          </motion.h1>

          <button
            onClick={exportToPDF}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            📄 Export PDF
          </button>
        </div>
      </header>

      {/* 🌙 Main Content (add spacing for header) */}
      <main className="max-w-5xl mx-auto px-4 mt-[40px] pb-10 space-y-8">

        {/* 📝 Summary Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/70 border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-indigo-500/50 transition"
        >
          <h2 className="text-xl font-bold text-indigo-400 mb-2">📝 Summary</h2>
          <p className="text-gray-300 leading-relaxed">
            {meeting.summary || "No summary available."}
          </p>
        </motion.section>

        {/* ✅ Action Items Section */}
        {meeting.tasks?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/70 border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-indigo-500/50 transition"
          >
            <h2 className="text-xl font-bold text-indigo-400 mb-3">✅ Action Items</h2>
            <ul className="space-y-3">
              {meeting.tasks.map((t, i) => (
                <li
                  key={i}
                  className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 hover:bg-gray-800/80 transition-all duration-300"
                >
                  <div className="font-medium text-white">{t.description}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    👤 {t.assignedTo} · 📅 {t.deadline} · 🔖 {t.priority}
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* 📜 Transcript Section */}
        {meeting.transcript && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-gray-900/70 border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-indigo-500/50 transition"
          >
            <h2 className="text-xl font-bold text-indigo-400 mb-3">📄 Full Transcript</h2>
            <div className="bg-gray-800/70 rounded-lg p-4 max-h-[450px] overflow-y-auto custom-scroll text-gray-300">
              <p className="whitespace-pre-wrap">{meeting.transcript}</p>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}

export default PublicReport;
