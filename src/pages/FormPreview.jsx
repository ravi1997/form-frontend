// src/pages/FormPreview.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import FormPreview from '../components/FormPreview';

export default function FormPreviewPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state?.form || !state?.formData || !state?.repeatData) {
        return (
            <div className="p-6 text-white bg-black min-h-screen">
                <p className="text-red-500">⚠️ Missing preview data. Please return to the form.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full"
                >
                    ⬅ Back to Form
                </button>
            </div>
        );
    }

    return (
        <FormPreview
            form={state.form}
            formData={state.formData}
            repeatData={state.repeatData}
        />
    );
}
