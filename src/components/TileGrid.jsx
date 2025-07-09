// TileGrid.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TileGrid = ({ tiles }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiles.map((tile, idx) => (
                <div
                    key={idx}
                    onClick={() => navigate(tile.path)}
                    className="cursor-pointer bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-blue-500 shadow hover:shadow-lg p-6 rounded-lg transition"
                >
                    <div className="text-3xl mb-2">{tile.icon}</div>
                    <div className="text-lg font-semibold text-slate-800 dark:text-white">
                        {tile.title}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TileGrid;
