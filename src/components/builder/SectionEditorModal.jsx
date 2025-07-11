import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';

const SectionEditorModal = ({ open, onClose, section, onSave }) => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (section) {
            setTitle(section.title || '');
            setQuestions(section.questions || []);
        }
    }, [section]);

    const handleAddQuestion = () => {
        const id = crypto.randomUUID();
        setQuestions(prev => [
            ...prev,
            { id, label: '', type: 'input', meta_data: { variable_name: '' } }
        ]);
    };

    const updateQuestion = (id, field, value) => {
        setQuestions(prev =>
            prev.map(q => q.id === id ? { ...q, [field]: value } : q)
        );
    };

    const handleSave = () => {
        const updated = {
            ...section,
            title,
            questions,
        };
        onSave(updated);
        onClose();
    };

    if (!section) return null;

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white p-6 rounded max-w-2xl w-full space-y-4">
                    <Dialog.Title className="text-lg font-bold">Edit Section</Dialog.Title>

                    <input
                        className="w-full p-2 border rounded"
                        placeholder="Section Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="space-y-2">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="border p-2 rounded space-y-1">
                                <input
                                    className="w-full p-1 border rounded"
                                    placeholder={`Question ${idx + 1} label`}
                                    value={q.label}
                                    onChange={(e) => updateQuestion(q.id, 'label', e.target.value)}
                                />
                                <select
                                    className="w-full p-1 border rounded"
                                    value={q.type}
                                    onChange={(e) => updateQuestion(q.id, 'type', e.target.value)}
                                >
                                    <option value="input">Text</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="select">Dropdown</option>
                                    <option value="radio">Radio</option>
                                    <option value="checkbox">Checkbox</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleAddQuestion}
                        className="bg-gray-200 px-3 py-1 rounded"
                    >
                        + Add Question
                    </button>

                    <div className="flex justify-end gap-2 pt-4">
                        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
                            Save
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default SectionEditorModal;
