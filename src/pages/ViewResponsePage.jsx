// src/pages/ViewResponsePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getForm, getResponseById } from '../api/formApi';
import FormPreview from '../components/FormPreview';

function mapResponseToFormFormat(responseData) {
    const formData = {};
    const repeatData = {};

    for (const [sectionId, sectionValue] of Object.entries(responseData)) {
        if (Array.isArray(sectionValue)) {
            repeatData[sectionId] = sectionValue;
        } else if (typeof sectionValue === 'object' && sectionValue !== null) {
            for (const [questionId, value] of Object.entries(sectionValue)) {
                formData[`${sectionId}.${questionId}`] = value;
            }
        }
    }

    return { formData, repeatData };
}

export default function ViewResponsePage() {
    const { formId, responseId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [formData, setFormData] = useState(null);
    const [repeatData, setRepeatData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [formResp, response] = await Promise.all([
                    getForm(formId),
                    getResponseById(formId, responseId),
                ]);

                setForm(formResp);
                const { formData, repeatData } = mapResponseToFormFormat(response.data);
                setFormData(formData);
                setRepeatData(repeatData);
            } catch (err) {
                console.error('❌ Error fetching response:', err);
                setError('Failed to load form or response');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [formId, responseId]);

    if (loading) return <div className="p-6 text-white bg-black min-h-screen">Loading...</div>;

    if (error || !form || !formData) {
        return (
            <div className="p-6 text-white bg-black min-h-screen">
                <p className="text-red-500">⚠️ {error || 'Missing data.'}</p>
                <button
                    onClick={() => navigate('/formResponse/' + formId)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full"
                >
                    ⬅ Back
                </button>
            </div>
        );
    }

    return (
        <FormPreview
            form={form}
            formData={formData}
            repeatData={repeatData}
        />
    );
}
