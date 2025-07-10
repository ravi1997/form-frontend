// FormHomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FormGrid from '../components/FormGrid';

const dummyForms = [
  { id: 'dc8e18b4-b0ad-4b76-a4c5-cd340f84d494', title: 'Patient Ophthalmic Evaluation', description: 'Comprehensive eye examination and treatment planning form.' },
  { id: 'form-2', title: 'Eye Checkup Sheet', description: 'For refraction and diagnostics' },
  { id: 'form-3', title: 'Consent Form', description: 'Patient procedure agreement' },
];

const FormHomePage = () => {
  const navigate = useNavigate();

  // Sidebar items just for navigation consistency, not clickable in this context
  const sidebarTiles = [
    { title: 'Back to Home', icon: '🏠', path: '/' },
    { title: 'My Forms', icon: '📝', path: '/forms' },
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
      <FormGrid forms={dummyForms} />
    </DashboardLayout>
  );
};

export default FormHomePage;
