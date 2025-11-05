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

  // 🔁 Rotate AI processing steps
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

  // 🧠 Fetch meeting data
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

  // ⏱ Poll while processing
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

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // 📄 Export to PDF
  const exportToPDF = () => {
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
      meeting.tasks.forEach((task, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${index + 1}. ${task.description}`, margin, y);
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
      const transcriptLines = doc.splitTextToSize(
        meeting.transcript,
        pageWidth - 2 * margin
      );
      transcriptLines.forEach((line) => {
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
      high: "bg-red-50 border border-red-300 text-red-800",
      medium: "bg-yellow-50 border border-yellow-300 text-yellow-800",
      low: "bg-green-50 border border-green-300 text-green-800",
    };
    return colors[priority] || colors.medium;
  };

  const enableShare = async () => {
    const { data } = await api.post(`/meetings/${id}/share`);
    const url = data.shareUrl || `${window.location.origin}/p/${data.token}`;
    setShareInfo({ url, enabled: true });
    try {
      await navigator.clipboard.writeText(url);
      alert("Share link copied to clipboard");
    } catch {}
  };

  const disableShare = async () => {
    await api.delete(`/meetings/${id}/share`);
    setShareInfo({ url: "", enabled: false });
  };

  // 🌀 YouTube-style processing loader
  if (meeting?.status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 text-center px-4">
        {/* Spinner */}
        <div className="relative mb-6">
          <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 opacity-20"></div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Processing your meeting
        </h2>
        <p className="text-gray-600 mb-6 text-lg">{aiSteps[aiStep]}</p>

        {/* Progress bar */}
        <div className="w-full max-w-sm bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-in-out"
            style={{
              width: `${((aiStep + 1) / aiSteps.length) * 100}%`,
            }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          {Math.round(((aiStep + 1) / aiSteps.length) * 100)}% completed
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">Meeting not found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main report content
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
            <p className="text-sm text-gray-600">
              {new Date(meeting.createdAt).toLocaleDateString()} at{" "}
              {new Date(meeting.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              ← Back
            </button>
            <button
              onClick={exportToPDF}
              disabled={meeting.status !== "completed"}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              📄 Export PDF
            </button>
            {shareInfo.enabled ? (
              <>
                <a
                  href={shareInfo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Open Share Link
                </a>
                <button
                  onClick={disableShare}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                >
                  Disable Share
                </button>
              </>
            ) : (
              <button
                onClick={enableShare}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Enable Share
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {meeting.status === "failed" && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            ❌ Processing failed. Please try uploading again.
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            {meeting.summary ||
              "Summary will appear after processing is complete."}
          </p>
        </div>

        {meeting.tasks && meeting.tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Action Items</h2>
            <div className="space-y-3">
              {meeting.tasks.map((task, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 ${getPriorityColor(task.priority)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium flex-1">{task.description}</p>
                    <span className="text-xs font-bold uppercase ml-2">
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-sm flex gap-4">
                    <span>👤 {task.assignedTo}</span>
                    <span>📅 {task.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {meeting.transcript && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📄 Full Transcript</h2>
            <div className="bg-gray-50 rounded p-4 max-h-96 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap">{meeting.transcript}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Report;
