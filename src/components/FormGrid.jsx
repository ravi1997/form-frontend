// FormGrid.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FormGrid = ({ forms, url }) => {
  const navigate = useNavigate();
  const myUrl = url + '/';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {forms.map((form) => (
        <div
          key={form.id}
          onClick={() => navigate(`${myUrl}${form.id}`)}
          className="cursor-pointer bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-blue-500 shadow hover:shadow-lg p-6 rounded-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
            {form.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{form.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FormGrid;
