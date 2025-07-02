import React, { useState } from 'react';

export default function QuestionRenderer({ question, register, readOnly = false, formData, form, historyhandleFetchComplete }) {
    const id = question.fieldKey || question.id;
    const label = question.label;
    const required = question.is_required;
    const helpText = question.help_text || '';
    const options = question.options || [];
    const fieldType = question.field_type;
    const shouldShowFetch = question.meta_data?.history === true || !!question.field_api_call;

    const inputBase =
        'w-full px-4 pt-2 pb-2 text-sm bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-accentHi disabled:opacity-60';

    const control = register(id);

    const [fetching, setFetching] = useState(false);

    const handleFetchClick = async () => {
        const value = formData?.[id];
        const questionId = question.id;
        const formId = form?.id || "dc8e18b4-b0ad-4b76-a4c5-cd340f84d494"; // Replace with actual dynamic value if passed
        if (!value || !questionId) {
            alert("Missing required value or question ID");
            return;
        }

        setFetching(true);
        try {
            const url = `https://rpcapplication.aiims.edu/form/api/v1/form/${formId}/history?question_id=${questionId}&primary_value=${value}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // ✅ This sends cookies (like session or auth)
            });
            if (!response.ok) throw new Error("Fetch failed");

            const data = await response.json();
            console.log("Fetched data:", data);

            // Optional: if parent needs to update formData
            if (historyhandleFetchComplete) historyhandleFetchComplete(data);

        } catch (err) {
            console.error("Error fetching data:", err);
            alert("Fetch failed");
        } finally {
            setFetching(false);
        }
    };



    return (
        <div className="p-2 rounded-xl space-y-2">
            {(fieldType === 'input' || fieldType === 'textarea') && (
                <div className="space-y-1">
                    <label htmlFor={id} className="block text-sm text-white font-medium">
                        {label}
                        {required && <span className="text-red-400"> *</span>}
                    </label>
                    {fieldType === 'input' ? (
                        <input
                            id={id}
                            type="text"
                            className={inputBase}
                            disabled={readOnly}
                            {...control}
                        />
                    ) : (
                        <textarea
                            id={id}
                            rows="4"
                            className={inputBase}
                            disabled={readOnly}
                            {...control}
                        />
                    )}
                    {helpText && <p className="text-xs text-white/40 mt-1">{helpText}</p>}
                </div>
            )}

            {fieldType === 'select' && (
                <div className="space-y-1">
                    <label htmlFor={id} className="block text-sm text-white font-medium">
                        {label}
                        {required && <span className="text-red-400"> *</span>}
                    </label>
                    <select
                        id={id}
                        disabled={readOnly}
                        className="w-full px-4 py-2 text-sm bg-white/10 border border-white/20 text-white rounded-md backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-accentHi focus:border-accentHi disabled:opacity-60"
                        {...control}
                    >
                        <option value="">Select an option</option>
                        {options.map((opt) => (
                            <option key={opt.id} value={opt.option_value} className="text-black">
                                {opt.option_label}
                            </option>
                        ))}
                    </select>
                    {helpText && <p className="text-xs text-white/40 mt-1">{helpText}</p>}
                </div>
            )}

            {fieldType === 'radio' && (
                <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                        {label}
                        {required && <span className="text-red-400"> *</span>}
                    </p>
                    <div className="space-y-2">
                        {options.map((opt) => (
                            <label key={opt.id} className="flex items-center gap-3 text-white">
                                <input
                                    type="radio"
                                    disabled={readOnly}
                                    className="accent-accentHi"
                                    value={opt.option_value}
                                    {...register(id)}
                                    name={id}
                                />
                                <span>{opt.option_label}</span>
                            </label>
                        ))}
                    </div>
                    {helpText && <p className="text-xs text-white/40 mt-1">{helpText}</p>}
                </div>
            )}

            {fieldType === 'checkbox' && (
                <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <div className="space-y-2">
                        {options.map((opt) => (
                            <label key={opt.id} className="flex items-center gap-3 text-white">
                                <input
                                    type="checkbox"
                                    disabled={readOnly}
                                    className="accent-accentHi"
                                    value={opt.option_value}
                                    {...register(id)}
                                />
                                <span>{opt.option_label}</span>
                            </label>
                        ))}
                    </div>
                    {helpText && <p className="text-xs text-white/40 mt-1">{helpText}</p>}
                </div>
            )}

            {shouldShowFetch && (
                <div className="mt-2">
                    <button
                        type="button"
                        onClick={() => handleFetchClick()}  // formData holds value
                        disabled={fetching}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow-md transition duration-200
                            ${fetching
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white'}
                        `}
                    >
                        {fetching ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14v1a3 3 0 01-3 3H6m13-4l-3 3m3-3l-3-3M5 10V9a3 3 0 013-3h10m-13 4l3-3m-3 3l3 3" />
                            </svg>
                        )}
                        {fetching ? "Fetching..." : "Fetch"}
                    </button>
                </div>
            )}



        </div>
    );
}
