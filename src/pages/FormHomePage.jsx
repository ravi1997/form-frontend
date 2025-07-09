// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const dummyForms = [
//   { id: 'form-1', title: 'Patient Intake Form', description: 'Basic information form' },
//   { id: 'form-2', title: 'Eye Checkup Sheet', description: 'For refraction and diagnostics' },
//   { id: 'form-3', title: 'Consent Form', description: 'Patient procedure agreement' },
// ];

// const FormHomePage = () => {
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', darkMode);
//   }, [darkMode]);

//   const handleFormClick = (formId) => {
//     navigate(`/form/${formId}`);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-800 dark:text-white transition-colors duration-300">
//       {/* Header */}
//       <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-md">
//         <h1 className="text-2xl font-bold">Assigned Forms</h1>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="text-xl hover:text-yellow-400 transition"
//             title="Toggle theme"
//           >
//             {darkMode ? '🌙' : '☀️'}
//           </button>
//           <button
//             onClick={() => navigate('/')}
//             className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
//           >
//             ← Back to Home
//           </button>
//         </div>
//       </header>

//       {/* Form List */}
//       <main className="p-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {dummyForms.map((form) => (
//             <div
//               key={form.id}
//               onClick={() => handleFormClick(form.id)}
//               className="cursor-pointer bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-blue-500 shadow hover:shadow-lg p-6 rounded-lg transition"
//             >
//               <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
//                 {form.title}
//               </h2>
//               <p className="text-sm text-slate-600 dark:text-slate-300">{form.description}</p>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default FormHomePage;



// FormHomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FormGrid from '../components/FormGrid';

const dummyForms = [
  { id: 'dc8e18b4-b0ad-4b76-a4c5-cd340f84d494', title: 'Patient Intake Form', description: 'Basic information form' },
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
