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
