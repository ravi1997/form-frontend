// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const sidebarTiles = [
  { title: 'Back to Home', icon: '🏠', path: '/' },
  { title: 'Settings', icon: '⚙️', path: '/settings' }
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    document.cookie = 'access_token=; Max-Age=0; path=/';
    navigate('/login');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('🚫 Passwords do not match.');
      return;
    }
    // API call to change password here
    setMessage('✅ Password updated successfully!');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <DashboardLayout tiles={sidebarTiles} user={user}>
      <div className="space-y-10">
        {/* Profile Info */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Profile Info</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </section>

        {/* Password Update */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Update Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {message && <p className="text-sm text-blue-500">{message}</p>}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Changes
            </button>
          </form>
        </section>

        {/* Actions */}
        <section className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-xl hover:text-yellow-400"
              title="Toggle Theme"
            >
              {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
