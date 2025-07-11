import React from 'react';

const QuestionEditor = ({ index, question, onChange }) => {
    const update = (field, value) => {
        onChange({ ...question, [field]: value });
    };

    return (
        <div className="border p-3 rounded shadow-sm bg-gray-50">
            <h4 className="font-medium mb-2">Question {index + 1}</h4>
            <input
                className="w-full p-2 border rounded mb-2"
                placeholder="Label"
                value={question.label}
                onChange={e => update('label', e.target.value)}
            />
            <select
                className="w-full p-2 border rounded"
                value={question.type}
                onChange={e => update('type', e.target.value)}
            >
                <option value="input">Input</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
            </select>
        </div>
    );
};

export default QuestionEditor;
