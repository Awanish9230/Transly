import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';

function PublicReport() {
  const { token } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/public/meetings/${token}`);
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
    doc.text('Summary', margin, y); y += 7;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(meeting.summary || 'No summary available', pageWidth - 2 * margin);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 10;

    if (meeting.tasks && meeting.tasks.length > 0) {
      doc.setFontSize(14); doc.text('Action Items', margin, y); y += 7;
      doc.setFontSize(10);
      meeting.tasks.forEach((task, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`${i + 1}. ${task.description}`, margin, y); y += 5;
        doc.text(`   Assigned: ${task.assignedTo} | Deadline: ${task.deadline} | Priority: ${task.priority}`, margin, y); y += 8;
      });
    }

    if (meeting.transcript) {
      doc.addPage(); y = 20; doc.setFontSize(14); doc.text('Full Transcript', margin, y); y += 7;
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(meeting.transcript, pageWidth - 2 * margin);
      lines.forEach((line) => { if (y > 280) { doc.addPage(); y = 20; } doc.text(line, margin, y); y += 5; });
    }

    doc.save(`${meeting.title}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!meeting) return <div className="min-h-screen flex items-center justify-center text-red-600">Link invalid or report unavailable.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{meeting.title}</h1>
          <button onClick={exportToPDF} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">📄 Export PDF</button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-2">📝 Summary</h2>
          <p className="text-gray-700">{meeting.summary || 'No summary available.'}</p>
        </section>
        {meeting.tasks && meeting.tasks.length > 0 && (
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-2">✅ Action Items</h2>
            <ul className="space-y-3">
              {meeting.tasks.map((t, i) => (
                <li key={i} className="border rounded p-3">
                  <div className="font-medium">{t.description}</div>
                  <div className="text-sm text-gray-600">👤 {t.assignedTo} · 📅 {t.deadline} · 🔖 {t.priority}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {meeting.transcript && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-2">📄 Full Transcript</h2>
            <div className="bg-gray-50 rounded p-3 max-h-96 overflow-y-auto">
              <p className="whitespace-pre-wrap text-gray-700">{meeting.transcript}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default PublicReport;
