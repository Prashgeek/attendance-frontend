
// frontend/src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/users';
import Login2FA from '../../components/Login2FA';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'student',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2FA state
  const [twoFAPending, setTwoFAPending] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const [setupData, setSetupData] = useState(null); // <-- NEW: store setup info (qr + backup codes)

  const GENERIC_ERROR = 'Login failed. Please check your credentials and try again.';

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleDemo = (role) => {
    const map = {
      admin: { email: 'admin@example.com', password: 'admin123', role: 'admin' },
      teacher: { email: 'teacher@example.com', password: 'teacher123', role: 'teacher' },
      student: { email: 'student@example.com', password: 'student123', role: 'student' }
    };
    const creds = map[role] || {};
    setForm(prev => ({ ...prev, ...creds }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.email.trim() || !form.password.trim() || !form.role) {
      setError(GENERIC_ERROR);
      return;
    }

    setLoading(true);

    try {
      // Note: login() posts to /api/auth/login
      const res = await login({
        email: form.email.trim(),
        password: form.password,
        selectedRole: form.role
      });

      const data = res?.data;

      // If backend indicates 2FA is required:
      if (data?.twoFARequired || data?.twoFASetupRequired) {
        setTwoFAPending(true);
        setTempToken(data.tempToken || null);

        // store optional setup data (QR + backup codes) to show in 2FA UI
        if (data.setup) {
          setSetupData(data.setup);
        } else {
          setSetupData(null);
        }

        setLoading(false);
        return;
      }

      if (data && data.user) {
        // Role mismatch check
        if (data.user.role !== form.role) {
          setError(GENERIC_ERROR);
          setLoading(false);
          return;
        }

        // Successful login (no 2FA required)
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'admin') navigate('/admin', { replace: true });
        else if (data.user.role === 'teacher') navigate('/teacher', { replace: true });
        else navigate('/student', { replace: true });
      } else {
        setError(GENERIC_ERROR);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(GENERIC_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // callback when 2FA verification succeeded
  const handle2FASuccess = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    // navigate by role
    if (user.role === 'admin') navigate('/admin', { replace: true });
    else if (user.role === 'teacher') navigate('/teacher', { replace: true });
    else navigate('/student', { replace: true });
  };

  if (twoFAPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
        <Login2FA
          email={form.email}
          tempToken={tempToken}
          setup={setupData}        // <-- PASS setup here
          onSuccess={handle2FASuccess}
          onBack={() => {
            setTwoFAPending(false);
            setTempToken(null);
            setSetupData(null);
          }}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col items-center">
        <div className="bg-blue-600 w-14 h-14 flex items-center justify-center rounded-lg mb-4">
          <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-white" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="8" width="6" height="8" rx="2" ry="2" />
            <polyline points="9 8 12 11 15 8" />
            <path d="M15 12v3" />
            <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
          </svg>
        </div>

        <h1 className="text-lg font-semibold text-center">Attendance Tracking System</h1>
        <p className="text-gray-600 text-sm mb-6 text-center">Manage attendance with ease and precision</p>

        {error && (
          <div className="mb-4 w-full p-3 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full" noValidate>
          <h2 className="font-semibold text-base">Sign In</h2>
          <p className="text-sm text-gray-500 mb-3">Enter your credentials to access your dashboard</p>

          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <div className="relative mb-3">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <div className="relative mb-3">
            <input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <label htmlFor="role" className="block text-sm font-medium mb-1 text-gray-700">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-4 bg-white"
            required
          >
            <option value="">-- Select Role --</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student / Employee</option>
          </select>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-bold text-white transition-colors ${loading ? 'bg-gray-800 cursor-not-allowed' : 'bg-black hover:bg-gray-900'}`}
            aria-label="Sign In"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center text-gray-500 text-sm mt-6 relative">
            <div className="flex items-center justify-center">
              <span className="flex-1 border-t border-gray-300 mr-2"></span>
              DEMO QUICK LOGIN
              <span className="flex-1 border-t border-gray-300 ml-2"></span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button type="button" onClick={() => handleDemo('admin')} className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold text-sm hover:bg-gray-100 transition">Admin</button>
            <button type="button" onClick={() => handleDemo('teacher')} className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold text-sm hover:bg-gray-100 transition">Teacher</button>
            <button type="button" onClick={() => handleDemo('student')} className="flex-1 border border-gray-300 rounded-lg py-2 font-semibold text-sm hover:bg-gray-100 transition">Student</button>
          </div>
        </form>

        <p className="text-gray-500 text-xs mt-4 text-center">Demo Mode: Click any quick login button or select a role and sign in</p>
      </div>
    </main>
  );
}
