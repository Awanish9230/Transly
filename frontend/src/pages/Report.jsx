import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import jsPDF from "jspdf";

function Report({ user, setUser }) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareInfo, setShareInfo] = useState({ url: "", enabled: false });
  const [aiStep, setAiStep] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const aiSteps = [
    "🎧 Transcribing audio...",
    "✍️ Generating summary...",
    "📋 Extracting tasks...",
    "✅ Finalizing report...",
  ];

  // Rotate AI steps
  useEffect(() => {
    if (!meeting || meeting.status !== "processing") return;
    let index = 0;
    setAiStep(0);
    const interval = setInterval(() => {
      index = (index + 1) % aiSteps.length;
      setAiStep(index);
    }, 2500);
    return () => clearInterval(interval);
  }, [meeting?.status]);

  // Fetch meeting data
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const { data } = await api.get(`/meetings/${id}`);
        setMeeting(data);
        setShareInfo({
          url:
            data.isShared && data.shareToken
              ? `${window.location.origin}/p/${data.shareToken}`
              : "",
          enabled: !!data.isShared,
        });
      } catch (error) {
        console.error("Error fetching meeting:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeeting();
  }, [id]);

  // Polling while processing
  useEffect(() => {
    if (!id || meeting?.status !== "processing") return;
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/meetings/${id}`);
        setMeeting(data);
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [id, meeting?.status]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Export to PDF
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

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-900/30 border border-red-700 text-red-300",
      medium: "bg-yellow-900/30 border border-yellow-700 text-yellow-300",
      low: "bg-green-900/30 border border-green-700 text-green-300",
    };
    return colors[priority] || colors.medium;
  };

  const enableShare = async () => {
    const { data } = await api.post(`/meetings/${id}/share`);
    const url = data.shareUrl || `${window.location.origin}/p/${data.token}`;
    setShareInfo({ url, enabled: true });
    try {
      await navigator.clipboard.writeText(url);
      alert("Share link copied to clipboard!");
    } catch {}
  };

  const disableShare = async () => {
    await api.delete(`/meetings/${id}/share`);
    setShareInfo({ url: "", enabled: false });
  };

  // Processing animation
  if (meeting?.status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-center px-4">
        <div className="relative mb-6">
          <div className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-gray-700 opacity-20"></div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-100 mb-2">
          Processing your meeting
        </h2>
        <p className="text-gray-400 mb-6 text-lg">{aiSteps[aiStep]}</p>
        <div className="w-full max-w-sm bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-in-out"
            style={{ width: `${((aiStep + 1) / aiSteps.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {Math.round(((aiStep + 1) / aiSteps.length) * 100)}% completed
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-gray-300">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4">Loading meeting details...</p>
        </div>
      </div>
    );

  if (!meeting)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-center">
        <p className="text-red-400 text-xl mb-4">Meeting not found</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );

  // Main report layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Sticky Header */}
      <header className="top-0 left-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-700 shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-400">{meeting.title}</h1>
            <p className="text-sm text-gray-400">
              {new Date(meeting.createdAt).toLocaleDateString()} •{" "}
              {new Date(meeting.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              ← Back
            </button>
            <button
              onClick={exportToPDF}
              disabled={meeting.status !== "completed"}
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              📄 Export PDF
            </button>
            {shareInfo.enabled ? (
              <>
                <a
                  href={shareInfo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                >
                  Open Share Link
                </a>
                <button
                  onClick={disableShare}
                  className="bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Disable Share
                </button>
              </>
            ) : (
              <button
                onClick={enableShare}
                className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
              >
                Enable Share
              </button>
            )}
            {/* <button
              onClick={handleLogout}
              className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button> */}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12 space-y-8 mt-[-49px]">
        {meeting.status === "failed" && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-lg shadow">
            ❌ Processing failed. Please try uploading again.
          </div>
        )}

        {/* Summary */}
        <section className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-700 p-6 shadow-lg hover:border-indigo-600 transition">
          <h2 className="text-xl font-bold text-indigo-400 mb-3">📝 Summary</h2>
          <p className="text-gray-300 leading-relaxed">
            {meeting.summary || "Summary will appear after processing is complete."}
          </p>
        </section>

        {/* Tasks */}
        {meeting.tasks?.length > 0 && (
          <section className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-700 p-6 shadow-lg hover:border-indigo-600 transition">
            <h2 className="text-xl font-bold text-indigo-400 mb-4">✅ Action Items</h2>
            <div className="space-y-3">
              {meeting.tasks.map((t, i) => (
                <div key={i} className={`rounded-lg p-4 ${getPriorityColor(t.priority)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium flex-1">{t.description}</p>
                    <span className="text-xs font-bold uppercase ml-2">{t.priority}</span>
                  </div>
                  <div className="text-sm flex gap-4 text-gray-400">
                    <span>👤 {t.assignedTo}</span>
                    <span>📅 {t.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transcript */}
        {meeting.transcript && (
          <section className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-700 p-6 shadow-lg hover:border-indigo-600 transition">
            <h2 className="text-xl font-bold text-indigo-400 mb-4">📄 Full Transcript</h2>
            <div className="bg-gray-800/70 rounded p-4 max-h-96 overflow-y-auto custom-scroll">
              <p className="whitespace-pre-wrap text-gray-300">{meeting.transcript}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Report;
