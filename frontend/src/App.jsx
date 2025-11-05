import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Landing from './pages/Landing';
import PublicReport from './pages/PublicReport';
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData && userData !== 'undefined') {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) return null; // ⏳ wait until we check localStorage
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {!loading && (
          <>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/p/:token" element={<PublicReport />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/signup" element={<Signup setUser={setUser} />} />
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            {/* 🧩 Global Footer */}
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}


export default App;
