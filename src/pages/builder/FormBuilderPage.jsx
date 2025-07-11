// FormHomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import FormBuilderComponent from '../../components/builder/FormBuilderComponent';

const FormBuilderPage = () => {
    const navigate = useNavigate();

    // Sidebar items just for navigation consistency, not clickable in this context
    const sidebarTiles = [
        { title: 'Back to Home', icon: '🏠', path: '/' },
        { title: 'Create Form', icon: '📝', path: '/createform' },
    ];

    return (
        <DashboardLayout tiles={sidebarTiles}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Assigned Forms</h1>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                    ← Back to Home
                </button>
            </div>
            <FormBuilderComponent />
        </DashboardLayout>
    );
};

export default FormBuilderPage;
