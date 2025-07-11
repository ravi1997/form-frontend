// DashboardLayout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, tiles, user = { name: 'John Doe', avatar: 'https://i.pravatar.cc/100?u=john' } }) => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('theme');
        return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);



    const handleLogout = () => {
        // Optional: localStorage.removeItem('access_token');
        navigate('/');
    };

    return (
<div className="flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900 text-slate-800 dark:text-white transition-colors duration-300">
    {/* Sidebar */}
    <aside
        className={`transition-all duration-300 ${
            sidebarOpen ? 'w-full md:w-64' : 'w-20'
        } bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-4`}
    >
        <div className="flex items-center justify-between mb-6">
            <div className="text-2xl font-bold flex items-center">
                🧠 {sidebarOpen && <span className="ml-2">Dashboard</span>}
            </div>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:text-yellow-400 transition"
                title="Toggle Sidebar"
            >
                {sidebarOpen ? '⬅️' : '➡️'}
            </button>
        </div>

        <nav className="space-y-4 text-lg">
            {tiles.map((tile, idx) => (
                <button
                    key={idx}
                    onClick={() => navigate(tile.path)}
                    className="flex items-center gap-4 w-full text-left px-3 py-2 rounded transition hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <span>{tile.icon}</span>
                    {sidebarOpen && <span>{tile.title}</span>}
                </button>
            ))}
        </nav>
    </aside>

    {/* Main Content */}
    <main className="flex-1 p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8 transition-colors">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name} 👋
            </h1>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="text-xl hover:text-yellow-400 transition"
                    title="Toggle Theme"
                >
                    {darkMode ? '🌙' : '☀️'}
                </button>
                <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-white/20"
                    title={user.name}
                />
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                    Logout
                </button>
            </div>
        </header>

        {/* Dynamic Page Content */}
        {children}
    </main>
</div>

    );
};

export default DashboardLayout;
