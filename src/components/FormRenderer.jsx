import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import QuestionRenderer from './QuestionRenderer';
import { useNavigate } from 'react-router-dom';

/* ── Utils ───────────────────────────── */
function evaluateVisibility(condition, values) {
    try {
        if (!condition) return true;
        const func = new Function("values", `with (values) { return (${condition}); }`);
        return func(values);
    } catch (err) {
        console.warn("Visibility condition error:", err);
        return true;
    }
}

function getFieldKey(sectionId, question) {
    return question.meta_data?.variable_name || `${sectionId}.${question.id}`;
}

const reorderEvenOdd = (arr) => {
    const even = arr.filter((_, idx) => idx % 2 === 0);
    const odd = arr.filter((_, idx) => idx % 2 !== 0);
    return [...odd, ...even];
};

const ZigZagGrid = ({ questions, formData, handleInputChange, sectionId, setValue, setFormData, form }) => {
    const leftCol = [];
    const rightCol = [];

    questions.forEach((q, i) => {
        const key = getFieldKey(sectionId, q);
        const visible = evaluateVisibility(q.visibility_condition, formData);
        const field = visible ? (
            <QuestionRenderer
                key={q.id}
                question={{ ...q, fieldKey: key }}
                formData={formData}
                setFormData={setFormData}
                setValue={setValue}
                form={form}
                sectionId={sectionId}
            />
        ) : null;

        (i % 2 === 0 ? rightCol : leftCol).push(field);
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">{leftCol}</div>
            <div className="flex flex-col gap-6">{rightCol}</div>
        </div>
    );
};

/* ── Main Component ──────────────────── */
export default function FormRenderer({
    form,
    onSubmit,
    register,
    handleSubmit,
    setValue,
    historyhandleFetchComplete
}) {
    const navigate = useNavigate();
    const version = form.versions.at(-1);

    const [formData, setFormData] = useState({});
    const [newRow, setNewRow] = useState({});
    const [repeatData, setRepeatData] = useState({});
    const [editPrompt, setEditPrompt] = useState(null);
    const [deletePrompt, setDeletePrompt] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const initFormData = {};
        const repeatInit = {};

        version.sections.forEach(section => {
            if (section.is_repeatable_section) {
                repeatInit[section.id] = [];
            } else {
                section.questions.forEach(q => {
                    const key = getFieldKey(section.id, q);
                    initFormData[key] = '';
                });
            }
        });

        setFormData(initFormData);
        setRepeatData(repeatInit);
        setNewRow({});
    }, [form]);

    const showToast = (msg) => {
        setToast({ message: msg });
        setTimeout(() => setToast(null), 3000);
    };

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setNewRow(prev => ({ ...prev, [key]: value }));
    };

    const handleAddRow = (sectionId, questions) => {
        const entry = {};
        const cleared = {};

        questions.forEach(q => {
            const key = getFieldKey(sectionId, q);
            entry[q.id] = newRow[key] || formData[key] || '';
            cleared[key] = '';
        });

        setRepeatData(prev => ({
            ...prev,
            [sectionId]: [...prev[sectionId], entry]
        }));

        setFormData(prev => ({ ...prev, ...cleared }));
        setNewRow(cleared);
        showToast('Row added');
    };

    const handleEdit = () => {
        const { sectionId, rowIndex, questions } = editPrompt;
        const updated = {};

        questions.forEach(q => {
            const key = getFieldKey(sectionId, q);
            updated[q.id] = newRow[key] || '';
        });

        setRepeatData(prev => {
            const copy = [...prev[sectionId]];
            copy[rowIndex] = updated;
            return { ...prev, [sectionId]: copy };
        });

        setEditPrompt(null);
        setNewRow({});
        showToast('Row updated');
    };

    const handleDelete = () => {
        const { sectionId, rowIndex } = deletePrompt;
        setRepeatData(prev => {
            const copy = [...prev[sectionId]];
            copy.splice(rowIndex, 1);
            return { ...prev, [sectionId]: copy };
        });

        setDeletePrompt(null);
        showToast('Row deleted');
    };

    const handleDragEnd = (result, sectionId) => {
        if (!result.destination) return;

        const reordered = [...repeatData[sectionId]];
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        setRepeatData(prev => ({ ...prev, [sectionId]: reordered }));
    };

    const renderQuestions = (section) => {
        return section.questions.map(q => {
            const key = getFieldKey(section.id, q);
            if (!evaluateVisibility(q, formData)) return null;

            return (
                <QuestionRenderer
                    key={q.id}
                    question={{ ...q, fieldKey: key }}
                    formData={formData}
                    setFormData={setFormData}
                    setValue={setValue}
                    form={form}
                    sectionId={section.id}
                    historyhandleFetchComplete={historyhandleFetchComplete}
                />
            );
        });
    };

    return (
        <form onSubmit={handleSubmit(() => onSubmit({ ...formData, ...flattenRepeatData(repeatData) }))} className="space-y-12 text-white">
            {version.sections.map(section => {
                const repeatable = section.is_repeatable_section;
                const storedRows = repeatData[section.id] || [];

                return (
                    <fieldset key={section.id} className="p-4 border rounded-xl border-white/20 bg-white/5">
                        <legend className="text-xl font-semibold mb-4">{section.title}</legend>
                        {section.description && <p className="text-sm text-white/60 mb-4">{section.description}</p>}

                        {/* Table for repeatable rows */}
                        {repeatable && (
                            <div className="overflow-x-auto mb-6">
                                <DragDropContext onDragEnd={(res) => handleDragEnd(res, section.id)}>
                                    <Droppable droppableId={section.id}>
                                        {(provided) => (
                                            <table {...provided.droppableProps} ref={provided.innerRef} className="w-full text-sm text-white">
                                                <thead>
                                                    <tr>
                                                        {reorderEvenOdd(section.questions).map(q => (
                                                            <th key={q.id} className="px-4 py-2 border border-white/10">{q.label}</th>
                                                        ))}
                                                        <th className="px-4 py-2 border border-white/10">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {storedRows.map((row, idx) => (
                                                        <Draggable key={idx} draggableId={`${section.id}-${idx}`} index={idx}>
                                                            {(provided) => (
                                                                <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                    {reorderEvenOdd(section.questions).map(q => (
                                                                        <td key={q.id} className="px-4 py-2 border border-white/10">{row[q.id] || '-'}</td>
                                                                    ))}
                                                                    <td className="px-4 py-2 border border-white/10 space-x-2">
                                                                        <button type="button" onClick={() => {
                                                                            const init = {};
                                                                            section.questions.forEach(q => {
                                                                                const k = getFieldKey(section.id, q);
                                                                                init[k] = row[q.id] || '';
                                                                            });
                                                                            setNewRow(init);
                                                                            setEditPrompt({ sectionId: section.id, rowIndex: idx, questions: section.questions, ui: section.ui });
                                                                        }}>✏️</button>
                                                                        <button type="button" onClick={() =>
                                                                            setDeletePrompt({ sectionId: section.id, rowIndex: idx })
                                                                        }>🗑</button>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </tbody>
                                            </table>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        )}

                        {/* Input Grid */}
                        {section.ui === 'grid-cols-2' ? (
                            <ZigZagGrid
                                questions={section.questions}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                sectionId={section.id}
                                setFormData={setFormData}
                                setValue={setValue}
                                form={form}
                            />
                        ) : (
                            <div className="space-y-4">{renderQuestions(section)}</div>
                        )}

                        {repeatable && (
                            <button type="button" onClick={() => handleAddRow(section.id, section.questions)} className="mt-4 px-5 py-2 rounded-full bg-accentHi">
                                + Add Row
                            </button>
                        )}
                    </fieldset>
                );
            })}

            {/* Toast + Dialogs */}
            {toast && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm px-4 py-2 rounded shadow">
                    ✅ {toast.message}
                </div>
            )}

            {(deletePrompt || editPrompt) && (
                <Dialog open onClose={() => {
                    setDeletePrompt(null);
                    setEditPrompt(null);
                }} className="relative z-50">
                    <div className="fixed inset-0 bg-black/70" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md bg-gray-900 p-6 rounded-lg text-white">
                            {deletePrompt && (
                                <>
                                    <DialogTitle className="text-lg font-bold mb-4">Confirm Delete</DialogTitle>
                                    <p className="text-sm mb-6">Are you sure you want to delete this row?</p>
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => setDeletePrompt(null)} className="px-3 py-1.5 bg-gray-700">Cancel</button>
                                        <button onClick={handleDelete} className="px-3 py-1.5 bg-red-600">Delete</button>
                                    </div>
                                </>
                            )}
                            {editPrompt && (
                                <>
                                    <DialogTitle className="text-lg font-bold mb-4">Edit Row</DialogTitle>
                                    {editPrompt.ui === 'grid-cols-2' ? (
                                        <ZigZagGrid
                                            questions={editPrompt.questions}
                                            formData={formData}
                                            handleInputChange={handleInputChange}
                                            sectionId={editPrompt.sectionId}
                                            setFormData={setFormData}
                                            setValue={setValue}
                                            form={form}
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {editPrompt.questions.map(q => {
                                                const key = getFieldKey(editPrompt.sectionId, q);
                                                return (
                                                    <QuestionRenderer
                                                        key={q.id}
                                                        question={{ ...q, fieldKey: key }}
                                                        formData={formData}
                                                        setFormData={setFormData}
                                                        setValue={setValue}
                                                        form={form}
                                                        sectionId={editPrompt.sectionId}
                                                    />
                                                );
                                            })}
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button onClick={() => setEditPrompt(null)} className="px-3 py-1.5 bg-gray-700">Cancel</button>
                                        <button onClick={handleEdit} className="px-3 py-1.5 bg-blue-600">Save</button>
                                    </div>
                                </>
                            )}
                        </DialogPanel>
                    </div>
                </Dialog>
            )}

            <div className="text-right mt-10 space-x-4">
                <button
                    type="button"
                    onClick={() => navigate('/preview', { state: { form, formData, repeatData } })}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full"
                >
                    Preview
                </button>
                <button type="submit" className="px-6 py-3 bg-accentHi text-white rounded-full">
                    Submit
                </button>
            </div>
        </form>
    );
}

/* Helper: flatten repeatData */
function flattenRepeatData(repeatData) {
    const output = {};
    for (const [sectionId, rows] of Object.entries(repeatData)) {
        rows.forEach((row, index) => {
            for (const [qId, value] of Object.entries(row)) {
                output[`${sectionId}.${index}.${qId}`] = value;
            }
        });
    }
    return output;
}
