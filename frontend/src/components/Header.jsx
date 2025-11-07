import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Header({ user, completedMeetings = 0, onLogout, onSignIn, onSignUp, onAbout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown if clicked outside
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
    <header className="fixed top-0 left-0 w-full z-[1000] backdrop-blur-md bg-[#0f172a]/70 border-b border-gray-800/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🌐 Logo / App Name */}
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-transparent bg-clip-text cursor-pointer"
        >
          Transly
        </motion.h1>

        {/* 🧭 Navigation Links */}
        <nav className="hidden sm:flex space-x-8 items-center text-gray-300 font-medium">
          <button
            onClick={onAbout}
            className="hover:text-white transition-colors duration-200"
          >
            About Us
          </button>

          {/* 🔐 Sign In / Sign Up Buttons */}
          {!user ? (
            <>
              <button
                onClick={onSignIn}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.05] transition-all duration-200"
              >
                Sign In
              </button>

              <button
                onClick={onSignUp}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.05] transition-all duration-200"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div ref={menuRef} className="relative">
              {/* 👤 Avatar Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold shadow-md"
              >
                {firstLetter}
              </motion.button>

              {/* 📋 Dropdown Menu */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-56 bg-[#1e293b] border border-gray-700 rounded-2xl shadow-xl p-4"
                  >
                    <div className="text-center mb-3">
                      <p className="text-white font-semibold text-base">
                        {user?.name || "User"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {completedMeetings} meetings completed
                      </p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-2 rounded-xl font-semibold hover:scale-[1.02] transition-all duration-200"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* 📱 Mobile Menu (optional future expansion) */}
        <div className="sm:hidden flex items-center text-gray-400">
          {/* You can add a hamburger icon here for mobile later */}
        </div>
      </div>
    </header>
  );
}

export default Header;
