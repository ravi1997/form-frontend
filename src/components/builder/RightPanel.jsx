import React from 'react';

const RightPanel = ({ formMeta, setFormMeta, sections, setSections }) => {
    const addSection = () => {
        const id = crypto.randomUUID();
        setSections(prev => [...prev, { id, title: '', questions: [], position: { x: 100, y: 100 } }]);
    };

    const updateFormMeta = (field, value) => {
        setFormMeta(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Form Metadata</h2>
            <input
                className="w-full p-2 border rounded"
                value={formMeta.title}
                onChange={(e) => updateFormMeta('title', e.target.value)}
                placeholder="Form Title"
            />
            <textarea
                className="w-full p-2 border rounded"
                value={formMeta.description}
                onChange={(e) => updateFormMeta('description', e.target.value)}
                placeholder="Form Description"
            />

            <h2 className="text-lg font-semibold">Sections</h2>
            <ul className="space-y-2">
                {sections.map((sec, idx) => (
                    <li key={sec.id} className="border p-2 rounded bg-gray-50">
                        <input
                            className="w-full p-1 border rounded"
                            value={sec.title}
                            placeholder={`Section ${idx + 1}`}
                            onChange={(e) => {
                                const newTitle = e.target.value;
                                setSections(prev => prev.map(s => s.id === sec.id ? { ...s, title: newTitle } : s));
                            }}
                        />
                        <button
                            onClick={() => {
                                setSections(prev => prev.filter(s => s.id !== sec.id));
                            }}
                            className="text-red-600 text-sm"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>


            <button onClick={addSection} className="bg-green-600 text-white px-4 py-2 rounded w-full">
                + Add Section
            </button>
        </div>
    );
};

export default RightPanel;
