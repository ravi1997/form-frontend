import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getForm, submitResponse } from '../api/formApi';
import FormRenderer from '../components/FormRenderer';
import { getResponseById } from '../api/formApi';
import { useNavigate } from 'react-router-dom';

function mapResponseToFormFormat(responseData) {
    const formData = {};
    const repeatData = {};

    for (const [sectionId, sectionValue] of Object.entries(responseData)) {
        if (Array.isArray(sectionValue)) {
            // Repeatable section
            repeatData[sectionId] = sectionValue;
        } else if (typeof sectionValue === 'object' && sectionValue !== null) {
            // Non-repeatable section
            for (const [questionId, value] of Object.entries(sectionValue)) {
                formData[`${sectionId}.${questionId}`] = value;
            }
        }
    }

    return { formData, repeatData };
}


export default function FormPage() {
    const formId = 'dc8e18b4-b0ad-4b76-a4c5-cd340f84d494';
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const { register, handleSubmit, reset } = useForm();
    const [historyList, setHistoryList] = useState([]);
    const navigate = useNavigate();


    const historyhandleFetchComplete = (response) => {
        if (response?.data) {
            const latest = response.data
                .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
                .slice(0, 5);
                setHistoryList(latest);
        }
    };
    

    /* ── load schema ───────────────────────────────────── */
    useEffect(() => {
        getForm(formId)
            .then((res) => {
                setForm(res);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setMsg('❌ Could not load form – please login.');
            });
    }, []);

    /* ── transform + post ──────────────────────────────── */
    const onSubmit = async (values) => {
        const out = {};
        for (const [k, v] of Object.entries(values)) {
            const parts = k.split('.');
            if (parts.length === 3) {
                const [sec, idx, q] = parts;
                (out[sec] ??= [])[idx] = { ...(out[sec]?.[idx] || {}), [q]: v };
            } else {
                const [sec, q] = parts;
                out[sec] = { ...(out[sec] || {}), [q]: v };
            }
        }
        try {
            await submitResponse(form.id, out);
            setMsg('✅ Submitted – thanks!');
            reset();
        } catch (e) {
            setMsg('❌ Submit failed – please retry.');
        }
    };


    const handleHistoryClick = async (entry) => {
        try {

            const response = await getResponseById(formId, entry._id); // fetch full response
            const { formData, repeatData } = mapResponseToFormFormat(response.data);

            console.log('Full response data:', response.data);
            console.log('Mapped formData:', formData);
            console.log('Mapped repeatData:', repeatData);

            if (!form) {
                alert("Form schema not loaded yet.");
                return;
            }

            navigate('/preview', {
                state: {
                    form,
                    formData,
                    repeatData
                }
            });

            console.log('Navigating to preview with state');
        } catch (err) {
            alert('Failed to load full response');
        }
      };

    /* ── ui ────────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

                {/* Left: Main Form */}
                <div className="flex-1 rounded-3xl backdrop-blur-lg bg-frosted shadow-card hover:shadow-glow">
                    
                    <div className="px-10 pt-10">
                        {loading ? (
                            <div className="flex flex-col items-center py-24">
                                <div className="animate-spin h-12 w-12 border-4 border-accentHi border-t-transparent rounded-full" />
                                <p className="mt-6 text-gray-300">Loading …</p>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-4xl font-extrabold text-white mb-2">
                                    {form?.title}
                                </h1>
                                {form?.description && (
                                    <p className="text-indigo-200 mb-8 max-w-prose">{form.description}</p>
                                )}
                            </>
                        )}
                    </div>

                    {/* body */}
                    {!loading && form && (
                        <div className="px-5 pb-12">
                            <FormRenderer
                                form={form}
                                onSubmit={onSubmit}
                                register={register}
                                handleSubmit={handleSubmit}
                                historyhandleFetchComplete={historyhandleFetchComplete}
                            />

                            {/* status bubble */}
                            {msg && (
                                <p
                                    className={`mt-8 text-center text-sm font-semibold ${msg.startsWith('✅') ? 'text-emerald-400' : 'text-rose-400'
                                        }`}
                                >
                                    {msg}
                                </p>
                            )}
                        </div>
                    )}
                </div>
                {/* Right: History Section */}
                <div className="w-full lg:w-64">
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">Recent History</h3>
                        {historyList.length === 0 ? (
                            <p className="text-sm text-gray-400">No entries</p>
                        ) : (
                            <ul className="space-y-2">
                                {historyList.map((entry, index) => (
                                    <li
                                        key={index}
                                        className="p-2 rounded bg-gray-700 text-sm cursor-pointer hover:bg-gray-600 transition"
                                        onClick={() => handleHistoryClick(entry)}
                                    >
                                        {new Date(entry.submitted_at).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
