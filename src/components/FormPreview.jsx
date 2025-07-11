import React from 'react';

function evaluateVisibility(question, values) {
    try {
        if (!question.visibility_condition) return true;
        const func = new Function("values", `with (values) { return (${question.visibility_condition}); }`);
        return func(values);
    } catch (err) {
        console.warn("Visibility condition error:", err);
        return true;
    }
}

function getFieldKey(sectionId, question) {
    return question.meta_data?.variable_name || `${sectionId}.${question.id}`;
}

const FieldDisplay = ({ label, value }) => (
    <div className="mb-2">
        <label className="block text-sm font-medium text-slate-600 dark:text-white/70">{label}</label>
        <div className="bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white px-4 py-2 rounded-md">
            {value ?? '-'}
        </div>
    </div>
);

const PreviewSection = ({ section, formData, repeatData }) => {
    const visibleQuestions = section.questions.filter(q => evaluateVisibility(q, formData));
    const isGrid = section.ui === 'grid-cols-2';

    return (
        <fieldset className="p-4 rounded-xl border border-slate-200 dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-sm mb-8">
            <legend className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">{section.title}</legend>
            {section.description && (
                <p className="text-sm text-slate-600 dark:text-white/60 mb-4">{section.description}</p>
            )}

            {section.is_repeatable_section ? (
                (repeatData[section.id] || []).map((row, rowIdx) => (
                    <div key={rowIdx} className="mb-4 p-3 border border-slate-200 dark:border-white/10 rounded-md">
                        {isGrid ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {visibleQuestions.map(q => (
                                    <FieldDisplay key={q.id} label={q.label} value={row[q.id]} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {visibleQuestions.map(q => (
                                    <FieldDisplay key={q.id} label={q.label} value={row[q.id]} />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            ) : isGrid ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visibleQuestions.map(q => {
                        const key = getFieldKey(section.id, q);
                        return <FieldDisplay key={q.id} label={q.label} value={formData[key]} />;
                    })}
                </div>
            ) : (
                <div className="space-y-2">
                    {visibleQuestions.map(q => {
                        const key = getFieldKey(section.id, q);
                        return <FieldDisplay key={q.id} label={q.label} value={formData[key]} />;
                    })}
                </div>
            )}
        </fieldset>
    );
};

export default function FormPreview({ form, formData, repeatData }) {
    const version = form.versions.at(-1);

    return (
        <div className="min-h-screen px-6 py-10 bg-slate-100 dark:bg-gradient-to-br dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 transition-colors text-slate-800 dark:text-white">
            <h1 className="text-3xl font-bold mb-4">Preview Your Responses</h1>
            <p className="text-slate-600 dark:text-white/60 mb-8">Please review your details before final submission.</p>

            {version.sections.map(section => (
                <PreviewSection
                    key={section.id}
                    section={section}
                    formData={formData}
                    repeatData={repeatData}
                />
            ))}

            <div className="mt-10 text-right">
                <button
                    className="px-6 py-2 rounded-full bg-accentHi hover:bg-accentLo transition font-semibold text-white"
                    onClick={() => window.history.back()}
                >
                    ⬅ Back to Edit
                </button>
            </div>
        </div>
    );
}
