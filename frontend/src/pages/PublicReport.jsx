import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";

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
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3"></div>
        Loading Report...
      </div>
    );

  if (!meeting)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400 text-lg">
        ❌ Link invalid or report unavailable.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-200">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/40 shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {meeting.title}
          </h1>
          <button
            onClick={exportToPDF}
            className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-5 py-2 rounded-lg 
                     hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium"
          >
            📄 Export PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Summary Section */}
        <section className="bg-gray-900/70 backdrop-blur-md border border-gray-700/40 rounded-2xl shadow-lg p-6 hover:border-indigo-500/40 transition-all duration-300">
          <h2 className="text-xl font-semibold text-indigo-400 mb-3">
            📝 Summary
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {meeting.summary || "No summary available."}
          </p>
        </section>

        {/* Action Items */}
        {meeting.tasks && meeting.tasks.length > 0 && (
          <section className="bg-gray-900/70 backdrop-blur-md border border-gray-700/40 rounded-2xl shadow-lg p-6 hover:border-indigo-500/40 transition-all duration-300">
            <h2 className="text-xl font-semibold text-indigo-400 mb-3">
              ✅ Action Items
            </h2>
            <ul className="space-y-3">
              {meeting.tasks.map((t, i) => (
                <li
                  key={i}
                  className="border border-gray-700/50 bg-gray-800/70 rounded-lg p-4 hover:bg-gray-800/90 transition"
                >
                  <div className="font-medium text-gray-100 mb-1">
                    {t.description}
                  </div>
                  <div className="text-sm text-gray-400">
                    👤 {t.assignedTo || "Unassigned"} · 📅{" "}
                    {t.deadline || "No deadline"} · 🔖{" "}
                    {t.priority || "Normal"}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Full Transcript */}
        {meeting.transcript && (
          <section className="bg-gray-900/70 backdrop-blur-md border border-gray-700/40 rounded-2xl shadow-lg p-6 hover:border-indigo-500/40 transition-all duration-300">
            <h2 className="text-xl font-semibold text-indigo-400 mb-3">
              📄 Full Transcript
            </h2>
            <div className="bg-gray-800/80 border border-gray-700/40 rounded-lg p-4 max-h-[400px] overflow-y-auto custom-scroll">
              <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {meeting.transcript}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default PublicReport;
