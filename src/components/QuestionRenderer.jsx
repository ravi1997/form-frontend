import React, { useEffect, useState, useRef } from 'react';
import { getHistoryByQuestionId,getQuestionApiData } from '../api/formApi'; // update the path if needed

export default function QuestionRenderer({
    question,
    formData,
    setFormData,
    readOnly = false,
    setValue,
    form,
    sectionId,
    historyhandleFetchComplete
}) {
    const id = question.fieldKey || question.id;
    const label = question.label;
    const required = question.is_required;
    const helpText = question.help_text || '';
    const options = question.options || [];
    const fieldType = question.field_type;
    const shouldShowFetch = question.meta_data?.history === true || !!question.field_api_call;

    const [fetching, setFetching] = useState(false);
    const userModified = useRef(false); // prevent overriding after manual input

    /* ── Evaluate calculated_value ─────────────────────── */
    const evaluateCalculatedValue = (expr, data) => {
        try {
            const directMatch = expr.match(/^\$\{(\w+)\}$/);
            if (directMatch) return data?.[directMatch[1]] ?? '';

            const interpolated = expr.replace(/\$\{(.*?)\}/g, (_, key) => {
                const val = data?.[key.trim()];
                return val !== undefined && val !== null ? JSON.stringify(val) : 'null';
            });

            return new Function(`return (${interpolated})`)();
        } catch (err) {
            console.warn(`⚠️ Error evaluating ${expr}:`, err);
            return '';
        }
    };

    useEffect(() => {
        if (!question.calculated_value || readOnly || userModified.current) return;
        const evaluated = evaluateCalculatedValue(question.calculated_value, formData);

        if (evaluated !== undefined && evaluated !== null && formData?.[id] !== evaluated) {
            setFormData(prev => ({ ...prev, [id]: evaluated }));
            try {
                setValue(id, evaluated);
            } catch { }
        }
    }, [question.calculated_value, formData, readOnly]);

    /* ── Handle API/History fetch ─────────────────────── */
    const handleFetchClick = async () => {
        const value = formData?.[id];
        const formId = form?.id;
        const questionId = question.id;

        if (!value || !formId || !questionId) {
            alert("Missing value or question ID");
            return;
        }

        setFetching(true);
        try {
            if (question.meta_data?.history === true) {
                const data = await getHistoryByQuestionId(formId, questionId, value);
                historyhandleFetchComplete?.(data);
            }
            

            if (question.field_api_call) {
                const data = await getQuestionApiData(formId, sectionId, questionId, value);
            
                setFormData(prev => {
                    const updated = { ...prev, ...data };
                    Object.entries(data).forEach(([key, val]) => {
                        try {
                            setValue(key, val);
                        } catch {}
                    });
                    return updated;
                });
            }
            
        } catch (err) {
            console.error('❌ Fetch Error:', err);
            alert('Fetch failed');
        } finally {
            setFetching(false);
        }
    };

    /* ── Shared onChange Handler ───────────────────────── */
    const updateValue = (value) => {
        userModified.current = true;
        setFormData(prev => ({ ...prev, [id]: value }));
        try {
            setValue(id, value);
        } catch { }
    };

    /* ── Field Value ───────────────────────────────────── */
    const value = formData?.[id] ?? '';

    return (
        <div className="p-2 rounded-xl space-y-2">
            {/* Input / Textarea */}
            {(fieldType === 'input' || fieldType === 'textarea') && (
                <div className="space-y-1">
                    <label htmlFor={id} className="block text-sm text-white font-medium">
                        {label}{required && <span className="text-red-400"> *</span>}
                    </label>
                    {fieldType === 'input' ? (
                        <input
                            id={id}
                            type="text"
                            value={value}
                            disabled={readOnly}
                            className="w-full px-4 py-2 bg-white/10 text-white rounded-md text-sm"
                            onChange={e => updateValue(e.target.value)}
                        />
                    ) : (
                        <textarea
                            id={id}
                            rows="4"
                            value={value}
                            disabled={readOnly}
                            className="w-full px-4 py-2 bg-white/10 text-white rounded-md text-sm"
                            onChange={e => updateValue(e.target.value)}
                        />
                    )}
                    {helpText && <p className="text-xs text-white/40">{helpText}</p>}
                </div>
            )}

            {/* Select */}
            {fieldType === 'select' && (
                <div className="space-y-1">
                    <label htmlFor={id} className="block text-sm text-white font-medium">
                        {label}{required && <span className="text-red-400"> *</span>}
                    </label>
                    <select
                        id={id}
                        disabled={readOnly}
                        value={value}
                        onChange={e => updateValue(e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-md"
                    >
                        <option value="">Select an option</option>
                        {options.map(opt => (
                            <option key={opt.id} value={opt.option_value} className="text-black">
                                {opt.option_label}
                            </option>
                        ))}
                    </select>
                    {helpText && <p className="text-xs text-white/40">{helpText}</p>}
                </div>
            )}

            {/* Radio */}
            {fieldType === 'radio' && (
                <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{label}{required && <span className="text-red-400"> *</span>}</p>
                    <div className="space-y-2">
                        {options.map(opt => (
                            <label key={opt.id} className="flex items-center gap-3 text-white">
                                <input
                                    type="radio"
                                    name={id}
                                    value={opt.option_value}
                                    checked={value === opt.option_value}
                                    disabled={readOnly}
                                    className="accent-accentHi"
                                    onChange={() => updateValue(opt.option_value)}
                                />
                                <span>{opt.option_label}</span>
                            </label>
                        ))}
                    </div>
                    {helpText && <p className="text-xs text-white/40">{helpText}</p>}
                </div>
            )}

            {/* Checkbox */}
            {fieldType === 'checkbox' && (
                <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <div className="space-y-2">
                        {options.map(opt => {
                            const isChecked = Array.isArray(value) ? value.includes(opt.option_value) : false;
                            return (
                                <label key={opt.id} className="flex items-center gap-3 text-white">
                                    <input
                                        type="checkbox"
                                        value={opt.option_value}
                                        checked={isChecked}
                                        disabled={readOnly}
                                        className="accent-accentHi"
                                        onChange={e => {
                                            const checked = e.target.checked;
                                            const updated = Array.isArray(value) ? (
                                                checked ? [...value, opt.option_value] : value.filter(val => val !== opt.option_value)
                                            ) : checked ? [opt.option_value] : [];

                                            updateValue(updated);
                                        }}
                                    />
                                    <span>{opt.option_label}</span>
                                </label>
                            );
                        })}
                    </div>
                    {helpText && <p className="text-xs text-white/40">{helpText}</p>}
                </div>
            )}

            {/* Fetch Button */}
            {shouldShowFetch && (
                <div className="mt-2">
                    <button
                        type="button"
                        disabled={fetching}
                        onClick={handleFetchClick}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
              ${fetching ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        {fetching ? "Fetching..." : "Fetch"}
                    </button>
                </div>
            )}
        </div>
    );
}
