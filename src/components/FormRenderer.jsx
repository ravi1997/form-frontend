import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import QuestionRenderer from './QuestionRenderer';
import { useNavigate } from 'react-router-dom';

function evaluateVisibility(question, values) {
    try {
        if (!question.visibility_condition) return true;
        const func = new Function("values", `with (values) { return (${question.visibility_condition}); }`);
        return func(values);
    } catch (err) {
        console.warn("Visibility condition error:", err);
        return true; // Show field by default on error
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

const ZigZagGrid = ({ questions, newRow, formData, handleInputChange, sectionId }) => {
    const leftCol = [];
    const rightCol = [];

    questions.forEach((q, i) => {
        const key = getFieldKey(sectionId, q);
        const isVisible = evaluateVisibility(q, formData);
        const field = (
            isVisible ? (
                <div key={q.id}>
                    <QuestionRenderer
                        question={{ ...q, fieldKey: key }}
                        register={() => ({
                            name: key,
                            value: newRow[key] || '',
                            onChange: (e) => handleInputChange(key, e.target.value),
                        })}
                    />
                </div>
            ) : null
        );

        if (i % 2 === 0) {
            rightCol.push(field); // 1st, 3rd, 5th → Right
        } else {
            leftCol.push(field);  // 2nd, 4th, 6th → Left
        }
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-6">{leftCol}</div>
            <div className="flex flex-col gap-6">{rightCol}</div>
        </div>
    );
};
  



export default function FormRenderer({ form, onSubmit, register, handleSubmit, historyhandleFetchComplete }) {
    const navigate = useNavigate();

    const version = form.versions.at(-1);
    const [repeatData, setRepeatData] = useState(() =>
        Object.fromEntries(version.sections.filter(s => s.is_repeatable_section).map(s => [s.id, []]))
    );
    const [newRow, setNewRow] = useState({});
    

    const [formData, setFormData] = useState(() => {
        const init = {};
        version.sections.forEach(section => {
            section.questions.forEach(q => {
                const key = q.meta_data?.variable_name;
                if (key) {
                    init[key] = section.is_repeatable_section ? [] : "";
                }
            });
        });
        return init;
    });
    const [editPrompt, setEditPrompt] = useState(null);
    const [deletePrompt, setDeletePrompt] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleInputChange = (key, value) => {
        setNewRow(prev => ({ ...prev, [key]: value }));
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleAddRow = (sectionId, questions) => {
        const newEntry = {};
        questions.forEach(q => {
            const key = getFieldKey(sectionId, q);
            newEntry[q.id] = newRow[key] || '';
        });

        setRepeatData(prev => ({
            ...prev,
            [sectionId]: [...prev[sectionId], newEntry]
        }));

        setNewRow(prev => {
            const updated = { ...prev };
            questions.forEach(q => delete updated[getFieldKey(sectionId, q)]);
            return updated;
        });

        showToast('Row added');
    };

    const handleEdit = () => {
        const { sectionId, rowIndex, questions } = editPrompt;
        const updatedEntry = {};
        questions.forEach(q => {
            const key = getFieldKey(sectionId, q);
            updatedEntry[q.id] = newRow[key] || '';
        });

        setRepeatData(prev => {
            const updated = [...prev[sectionId]];
            updated[rowIndex] = updatedEntry;
            return { ...prev, [sectionId]: updated };
        });

        setEditPrompt(null);
        setNewRow({});
        showToast('Row updated');
    };

    const handleDelete = () => {
        const { sectionId, rowIndex } = deletePrompt;
        setRepeatData(prev => {
            const updated = [...prev[sectionId]];
            updated.splice(rowIndex, 1);
            return { ...prev, [sectionId]: updated };
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

    return (

        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 relative text-white">
                    {version.sections.map(section => {
                        const repeatable = section.is_repeatable_section;
                        const storedRows = repeatData[section.id] || [];

                        const renderQuestions = (qs) =>
                            qs.map((q) => {
                                const key = getFieldKey(section.id, q);
                                if (!evaluateVisibility(q, formData)) return null;
                                return (
                                    <QuestionRenderer
                                        key={q.id}
                                        question={{ ...q, fieldKey: key }}
                                        formData={formData}
                                        form={form}
                                        historyhandleFetchComplete={historyhandleFetchComplete}
                                        register={() => ({
                                            name: key,
                                            value: newRow[key] || '',
                                            onChange: (e) => handleInputChange(key, e.target.value)
                                        })}
                                    />
                                );
                            });

                        return (
                            <fieldset key={section.id} className="p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md">
                                <legend className="text-xl font-semibold mb-4">{section.title}</legend>
                                {section.description && <p className="text-sm text-white/60 mb-4">{section.description}</p>}

                                {/* Row Table */}
                                {repeatable && (
                                    <div className="overflow-x-auto border border-white/10 rounded-md mb-6">
                                        <DragDropContext onDragEnd={(result) => handleDragEnd(result, section.id)}>
                                            <Droppable droppableId={section.id}>
                                                {(provided) => (
                                                    <table {...provided.droppableProps} ref={provided.innerRef}
                                                        className="w-full text-sm table-auto border-collapse text-white">
                                                        <thead className="bg-white/10 text-white/70">
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
                                                                                    const initial = {};
                                                                                    section.questions.forEach(q => {
                                                                                        const k = getFieldKey(section.id, q);
                                                                                        initial[k] = row[q.id] || '';
                                                                                    });
                                                                                    setNewRow(initial);
                                                                                    setEditPrompt({ sectionId: section.id, rowIndex: idx, questions: section.questions, ui: section.ui });
                                                                                }} className="text-blue-400 hover:text-blue-600">✏️</button>
                                                                                <button type="button" onClick={() =>
                                                                                    setDeletePrompt({ sectionId: section.id, rowIndex: idx })}
                                                                                    className="text-red-400 hover:text-red-600">🗑</button>
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

                                {/* Form Fields */}
                                {section.ui === 'grid-cols-2'
                                    ? <ZigZagGrid
                                        questions={section.questions}
                                        newRow={newRow}
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        sectionId={section.id}
                                    />

                                    : <div className="space-y-4">{renderQuestions(section.questions)}</div>
                                }

                                {repeatable && (
                                    <button type="button"
                                        onClick={() => handleAddRow(section.id, section.questions)}
                                        className="mt-4 px-5 py-2 rounded-full bg-accentHi text-white font-medium hover:bg-accentLo transition">
                                        + Add Row
                                    </button>
                                )}
                            </fieldset>
                        );
                    })}

                    {/* Toast */}
                    {toast && (
                        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded shadow animate-fadeIn">
                            ✅ {toast.message}
                        </div>
                    )}

                    {/* Dialog */}
                    {(deletePrompt || editPrompt) && (
                        <Dialog open={!!(deletePrompt || editPrompt)} onClose={() => {
                            setDeletePrompt(null); setEditPrompt(null);
                        }} className="relative z-50">
                            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
                            <div className="fixed inset-0 flex items-center justify-center p-4">
                                <DialogPanel className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-gray-900 text-white shadow-xl p-6">
                                    {deletePrompt && (
                                        <>
                                            <DialogTitle className="text-lg font-bold mb-4">Confirm Delete</DialogTitle>
                                            <p className="text-sm text-white/70 mb-6">Are you sure you want to delete this row?</p>
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => setDeletePrompt(null)} className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600">Cancel</button>
                                                <button onClick={handleDelete} className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white">Delete</button>
                                            </div>
                                        </>
                                    )}
                                    {editPrompt && (
                                        <>
                                            <DialogTitle className="text-lg font-bold mb-4">Edit Row</DialogTitle>

                                            {editPrompt.ui === 'grid-cols-2' ? (
                                                <ZigZagGrid
                                                    questions={editPrompt.questions}
                                                    newRow={newRow}
                                                    formData={formData}
                                                    handleInputChange={handleInputChange}
                                                    sectionId={editPrompt.sectionId}
                                                />
                                            ) : (
                                                <div className="space-y-4">
                                                    {editPrompt.questions.map((q) => {
                                                        const key = getFieldKey(editPrompt.sectionId, q);
                                                        return (
                                                            <QuestionRenderer
                                                                key={q.id}
                                                                question={{ ...q, fieldKey: key }}
                                                                register={() => ({
                                                                    name: key,
                                                                    value: newRow[key] || '',
                                                                    onChange: (e) => handleInputChange(key, e.target.value),
                                                                })}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-3 mt-4">
                                                <button
                                                    onClick={() => setEditPrompt(null)}
                                                    className="px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleEdit}
                                                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </>

                                    )}
                                </DialogPanel>
                            </div>
                        </Dialog>
                    )}

                    <div className="text-right mt-10">
                        <button
                            type="button"
                            className="px-8 py-3 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                            onClick={() =>
                                navigate('/preview', {
                                    state: {
                                        form,
                                        formData,
                                        repeatData
                                    }
                                })
                            }
                        >
                            Preview
                        </button>

                        <button type="submit" className="px-8 py-3 rounded-full bg-accentHi text-white font-semibold shadow hover:shadow-lg transition">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            

        </div>


    );
}
