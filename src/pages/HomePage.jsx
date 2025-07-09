// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const tiles = [
//     { title: 'Fill out your assigned forms', icon: '📝', path: '/forms' },
//     { title: 'Resume partially filled forms', icon: '✍️', path: '/drafts' },
//     { title: 'View your previous responses', icon: '📊', path: '/responses' },
//     { title: 'Track your activity stats', icon: '📈', path: '/analytics' },
//     { title: 'Manage your profile and password', icon: '⚙️', path: '/settings' },
//     { title: 'Terms and privacy policy', icon: '📜', path: '/terms' },
// ];

// const HomePage = () => {
//     const navigate = useNavigate();
//     const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
//     const [sidebarOpen, setSidebarOpen] = useState(true);
//     const user = { name: 'John Doe', avatar: 'https://i.pravatar.cc/100?u=john' };

//     useEffect(() => {
//         document.documentElement.classList.toggle('dark', darkMode);
//         localStorage.setItem('theme', darkMode ? 'dark' : 'light');
//     }, [darkMode]);

//     const handleLogout = () => {
//         // Optional: localStorage.removeItem('access_token');
//         navigate('/');
//     };

//     return (
//         <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white transition-colors duration-300">

//             {/* Sidebar */}
//             <aside
//                 className={`bg-slate-900 text-white p-4 transition-all duration-300 ${sidebarOpen ? 'w-full md:w-64' : 'w-20'
//                     }`}
//             >
//                 <div className="flex items-center justify-between mb-6">
//                     <div className="text-2xl font-bold flex items-center">
//                         🧠 {sidebarOpen && <span className="ml-2">Dashboard</span>}
//                     </div>
//                     <button
//                         onClick={() => setSidebarOpen(!sidebarOpen)}
//                         className="text-white hover:text-yellow-400"
//                         title="Toggle Sidebar"
//                     >
//                         {sidebarOpen ? '⬅️' : '➡️'}
//                     </button>
//                 </div>

//                 <nav className="space-y-4 text-lg">
//                     {tiles.map((tile, idx) => (
//                         <button
//                             key={idx}
//                             onClick={() => navigate(tile.path)}
//                             className="flex items-center gap-4 w-full text-left px-3 py-2 hover:bg-slate-800 rounded transition"
//                         >
//                             <span>{tile.icon}</span>
//                             {sidebarOpen && <span>{tile.title}</span>}
//                         </button>
//                     ))}
//                 </nav>
//             </aside>

//             {/* Main Content */}
//             <main className="flex-1 p-4 sm:p-8">
//                 {/* Header */}
//                 <header className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
//                     <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome 👋</h1>
//                     <div className="flex items-center gap-4 mt-4 sm:mt-0">
//                         <button
//                             onClick={() => setDarkMode(!darkMode)}
//                             className="text-xl hover:text-yellow-400 transition"
//                             title="Toggle Theme"
//                         >
//                             {darkMode ? '🌙' : '☀️'}
//                         </button>
//                         <img
//                             src={user.avatar}
//                             alt="avatar"
//                             className="w-8 h-8 rounded-full border border-white/20"
//                             title={user.name}
//                         />
//                         <button
//                             onClick={handleLogout}
//                             className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </header>

//                 {/* Tiles */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {tiles.map((tile, idx) => (
//                         <div
//                             key={idx}
//                             onClick={() => navigate(tile.path)}
//                             className="cursor-pointer bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-blue-500 shadow hover:shadow-lg p-6 rounded-lg transition"
//                         >
//                             <div className="text-3xl mb-2">{tile.icon}</div>
//                             <div className="text-lg font-semibold text-slate-800 dark:text-white">
//                                 {tile.title}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default HomePage;


// HomePage.jsx
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TileGrid from '../components/TileGrid';

const tiles = [
    { title: 'Fill out your assigned forms', icon: '📝', path: '/forms' },
    { title: 'Resume partially filled forms', icon: '✍️', path: '/drafts' },
    { title: 'View your previous responses', icon: '📊', path: '/responses' },
    { title: 'Track your activity stats', icon: '📈', path: '/analytics' },
    { title: 'Manage your profile and password', icon: '⚙️', path: '/settings' },
    { title: 'Terms and privacy policy', icon: '📜', path: '/terms' },
];

const HomePage = () => {
    return (
        <DashboardLayout tiles={tiles}>
            <TileGrid tiles={tiles} />
        </DashboardLayout>
    );
};

export default HomePage;
