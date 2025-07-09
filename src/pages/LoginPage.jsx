// src/pages/LoginPage.jsx
import { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(
                'https://rpcapplication.aiims.edu/form/api/v1/auth/login',
                { email, password },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            const token = res.data.access_token;

            // ⚠️ Not HttpOnly, use only if backend doesn't set cookie
            document.cookie = `access_token=${token}; path=/; SameSite=Lax`;
            onLoginSuccess();
        } catch (err) {
            console.error('Login error:', err);
            setError('🚫 Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-blue-300 flex items-center justify-center">
            <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Login</h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="********"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 font-semibold"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Need help? Contact <a href="mailto:support@example.com" className="text-blue-600 underline">support</a>
                </p>
            </div>
        </div>
    );
}
