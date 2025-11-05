import { useState, useEffect, useRef } from "react";

function Header({ user, completedMeetings = 0, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="backdrop-blur-md bg-white/70 shadow-md fixed top-[36px] sm:top-[40px] left-0 w-full z-[1000] border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* 🎤 App Name */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text">
          Transly
        </h1>

        {/* 👤 Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          {/* 🧠 Avatar Circle */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold shadow-md hover:scale-105 transition-all"
          >
            {firstLetter}
          </button>

          {/* 📋 Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 transition-all duration-300">
              <div className="text-center mb-3">
                <p className="text-gray-900 font-semibold text-base">
                  {user?.name || "User"}
                </p>
                <p className="text-gray-600 text-sm">
                  {completedMeetings} meetings completed
                </p>
              </div>
              <button
                onClick={onLogout}
                className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 rounded-xl hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
