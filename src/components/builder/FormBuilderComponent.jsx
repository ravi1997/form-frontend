import React, { useState } from 'react';
import GraphCanvas from './GraphCanvas';
import RightPanel from './RightPanel';
import SectionEditorModal from './SectionEditorModal';
import { ReactFlowProvider } from 'reactflow';
const FormBuilderComponent = () => {
    const [formMeta, setFormMeta] = useState({ title: '', description: '' });
    const [sections, setSections] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(null);

    const handleSectionDoubleClick = (id) => {
        setSelectedSectionId(id);
    };

    const updateSection = (updated) => {
        setSections(prev => prev.map(sec => sec.id === updated.id ? updated : sec));
    };
  
    return (
        <div className="flex h-screen">
            {/* Sidebar (you already have this) */}
            <ReactFlowProvider>
                {/* Graph Canvas */}
                <div className="flex-1 bg-gray-100">
                    <GraphCanvas
                        sections={sections}
                        edges={edges}
                        onDoubleClickSection={handleSectionDoubleClick}
                        setEdges={setEdges}
                        setSections={setSections}
                    />
                </div>
            </ReactFlowProvider>
            <div className="w-96 border-l overflow-y-auto">
                <RightPanel
                    formMeta={formMeta}
                    setFormMeta={setFormMeta}
                    sections={sections}
                    setSections={setSections}
                />
            </div>

            <SectionEditorModal
                open={!!selectedSectionId}
                onClose={() => setSelectedSectionId(null)}
                section={sections.find(s => s.id === selectedSectionId)}
                onSave={updateSection}
            />

            
        </div>
    );
};

export default FormBuilderComponent;
