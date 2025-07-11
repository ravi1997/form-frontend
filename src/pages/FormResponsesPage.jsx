import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getResponsesForForm, getForm } from '../api/formApi';
import DashboardLayout from '../components/DashboardLayout';

const FormResponsesPage = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const [responses, setResponses] = useState([]);
    const [visibleHeaders, setVisibleHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sidebarTiles = [
        { title: 'Back to Home', icon: '🏠', path: '/' },
        { title: 'My Forms', icon: '📝', path: '/formsResponse' },
        { title: 'Current Form Responses', icon: '📋', path: `/formResponse/${formId}` },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [form, responseList] = await Promise.all([
                    getForm(formId),
                    getResponsesForForm(formId),
                ]);

                // Extract headers where visible_header is true
                const headers = [];
                form.versions.at(-1).sections.forEach(section => {
                    section.questions.forEach(q => {
                        if (q.visible_header) {
                            headers.push({
                                label: q.label,
                                skey: section.id,
                                qkey: q.id,
                            });
                        }
                    });
                });

                const sortedResponses = responseList.sort(
                    (a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)
                );

                setVisibleHeaders(headers);
                setResponses(sortedResponses);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch form or responses');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [formId]);

    return (
        <DashboardLayout tiles={sidebarTiles}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Form Responses</h1>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                    ← Back to Home
                </button>
            </div>
            <main className="p-6">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg">
                            <thead>
                                <tr className="text-left text-sm font-semibold border-b border-slate-200 dark:border-gray-700">
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Submitted At</th>
                                    {visibleHeaders.map(h => (
                                        <th key={h.key} className="px-4 py-2">{h.label}</th>
                                    ))}
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.map((res, index) => (
                                    <tr key={res._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">
                                            {new Date(res.submitted_at).toLocaleString()}
                                        </td>
                                        {visibleHeaders.map(h => (
                                            <td key={h.qkey} className="px-4 py-2">
                                                {res.data?.[h.skey]?.[h.qkey] ?? '-'}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2">
                                            <button
                                                className="text-blue-600 hover:underline"
                                                onClick={() => navigate(`/form/${formId}/response/${res._id}`)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </DashboardLayout>
    );
};

export default FormResponsesPage;
