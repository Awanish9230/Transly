import { useState, useEffect } from "react";
import { X } from "lucide-react";

function AnnouncementBar({
  message = "🎉 New update! Meeting AI summaries are now 3× faster 🚀",
  gradient = "from-indigo-700 via-blue-700 to-purple-700",
  storageKey = "announcementDismissed_v1",
}) {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false); // ✅ ensures localStorage check runs first
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(storageKey);
    if (dismissed !== "true") {
      setVisible(true);
    }
    setChecked(true); // ✅ mark as checked
  }, [storageKey]);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(storageKey, "true");
    }, 300);
  };

  // ✅ Don't render until we've checked localStorage
  if (!checked || !visible) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-gradient-to-r ${gradient} text-white shadow-lg z-[9999] transform transition-all duration-300 ${
        fading ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <p className="text-sm sm:text-base font-medium">{message}</p>
        <button
          onClick={handleDismiss}
          className="ml-4 text-white hover:text-gray-200 transition"
          aria-label="Close announcement"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;
