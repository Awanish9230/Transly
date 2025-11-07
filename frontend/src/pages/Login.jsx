import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      console.log('✅ Login API Response:', data);

      const userData = data.user || data;
      const token = data.token || userData.token;

      if (!userData || !token) {
        throw new Error('Invalid login response from server');
      }

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);

      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <div className="bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-blue-400 mb-2">
          🎤 Meeting AI
        </h2>
        <h3 className="text-xl text-center text-gray-300 mb-8">
          Login to your account
        </h3>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline hover:text-blue-300 transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
