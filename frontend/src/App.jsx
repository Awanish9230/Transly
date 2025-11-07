import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import PublicReport from "./pages/PublicReport";
import AboutUs from "./pages/AboutUs";

import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AudioUploader from "./components/AudioUploader";

// 🔁 Inner App component to access useNavigate
function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  // 🧭 Hide header/footer on login/signup
  const hideHeaderFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {!hideHeaderFooter && (
        <Header
          user={user}
          onLogout={handleLogout}
          onSignIn={() => navigate("/login")}
          onSignUp={() => navigate("/signup")}
          onHome={() => navigate(user ? "/dashboard" : "/")}
          onAbout={() => navigate("/about")}
        />
      )}

      <main className={`${!hideHeaderFooter ? "pt-[72px]" : ""} flex-grow`}>
        <Routes>
          {/* 🏠 Home Page */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <>
                  <HeroSection />
                  <div className="max-w-7xl mx-auto px-6 py-20">
                    <AudioUploader
                      onRequireLogin={() => {
                        alert("Please sign in to upload your meeting recording.");
                        navigate("/login");
                      }}
                    />
                  </div>
                </>
              )
            }
          />

          {/* ℹ️ About Us */}
          <Route path="/about" element={<AboutUs user={user} />} />

          {/* 🔐 Auth Pages */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          {/* 📊 Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard user={user} setUser={setUser} />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/:id"
            element={
              <PrivateRoute>
                <Report user={user} setUser={setUser} />
              </PrivateRoute>
            }
          />

          {/* 🌐 Public Report */}
          <Route path="/p/:token" element={<PublicReport />} />

          {/* 🚫 Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
