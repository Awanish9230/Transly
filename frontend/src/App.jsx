import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import PublicReport from "./pages/PublicReport";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AudioUploader from "./components/AudioUploader"; // assuming you already have this

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const PrivateRoute = ({ children }) => {
    if (loading) return null; // wait for localStorage check
    return user ? children : <Navigate to="/login" />;
  };

  // 🔐 Handler to require login before upload
  const handleRequireLogin = () => {
    if (!user) {
      alert("Please sign in to upload your meeting recording.");
      window.location.href = "/login";
    }
  };

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
        {/* 🌐 Global Header */}
        <Header
          user={user}
          onLogout={() => {
            localStorage.removeItem("user");
            setUser(null);
          }}
          onSignIn={() => (window.location.href = "/login")}
          onSignUp={() => (window.location.href = "/signup")}
          onAbout={() => alert("About Us section coming soon!")}
        />

        <Routes>
          {/* 🏠 Home Page (Dynamic) */}
          <Route
            path="/"
            element={
              user ? (
                <Dashboard user={user} setUser={setUser} />
              ) : (
                <>
                  <HeroSection scrollToUploader={handleRequireLogin} />
                  <div className="max-w-7xl mx-auto px-6 py-20">
                    <AudioUploader onRequireLogin={handleRequireLogin} />
                  </div>
                </>
              )
            }
          />

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

          {/* 🌐 Public Report View */}
          <Route path="/p/:token" element={<PublicReport />} />

          {/* 🚫 Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* 🧩 Footer (Visible to everyone) */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
