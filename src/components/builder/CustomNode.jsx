import React from 'react';
import { Handle } from 'reactflow';
import { EyeIcon } from 'lucide-react'; // Or any icon lib

const CustomNode = ({ data }) => {
    return (
        <div className="bg-white border rounded p-2 shadow w-40 text-center relative">
            <div className="flex justify-between items-center">
                <strong>{data.label}</strong>
                <EyeIcon className="w-4 h-4 text-gray-500" />
            </div>
            <Handle type="target" position="top" />
            <Handle type="source" position="bottom" />
        </div>
    );
};

export default CustomNode;
