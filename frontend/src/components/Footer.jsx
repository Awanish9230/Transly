import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* 🧠 Brand Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Transly</h2>
          <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
            Revolutionizing the way teams handle meetings — upload, transcribe,
            summarize, and manage insights effortlessly with AI.
          </p>
        </div>

        {/* ⚡ Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/dashboard" className="hover:text-white transition">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-white transition">
                Login
              </a>
            </li>
            <li>
              <a href="/signup" className="hover:text-white transition">
                Signup
              </a>
            </li>
          </ul>
        </div>

        {/* 🌐 Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Connect With Us
          </h3>
          <div className="flex space-x-5 mt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition transform hover:scale-110"
            >
              <FaGithub size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition transform hover:scale-110"
            >
              <FaLinkedin size={22} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition transform hover:scale-110"
            >
              <FaTwitter size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* 🔻 Bottom Line */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-white font-semibold">Transly</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
