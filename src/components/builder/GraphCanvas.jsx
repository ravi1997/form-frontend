import React, { useEffect, useMemo, useCallback } from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
const nodeTypes = { customNode: CustomNode };

const GraphCanvas = ({ sections, edges, setSections, setEdges, onDoubleClickSection }) => {

    // Initial state
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

    // 🔁 Sync sections → nodes
    useEffect(() => {
        const nextNodes = sections.map(section => ({
            id: section.id,
            type: 'customNode',
            data: { label: section.title || 'Untitled Section', section },
            position: section.position || { x: Math.random() * 400, y: Math.random() * 400 },
        }));
        setNodes(nextNodes);
    }, [sections, setNodes]);

    // 🔁 Update position in sections
    const handleNodesChange = useCallback((changes) => {
        onNodesChange(changes);
        const moved = changes.filter(c => c.type === 'position' && (c.position || c.positionAbsolute));
        if (moved.length > 0) {
            console.log('Moved sections:', moved);
            setSections(prev =>
                prev.map(section => {
                    const change = moved.find(c => c.id === section.id);
                    return change
                        ? { ...section, position: change.positionAbsolute ?? change.position }
                        : section;
                })
            );
        }
    }, [onNodesChange, setSections]);
      

    const handleConnect = useCallback(
        (connection) => {
            const newEdge = { ...connection, label: '→', animated: true };
            setLocalEdges(eds => addEdge(newEdge, eds));
            setEdges(eds => addEdge(newEdge, eds));
        },
        [setLocalEdges, setEdges]
    );

    const handleNodeDoubleClick = (_event, node) => {
        onDoubleClickSection(node.id);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={localEdges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                onNodeDoubleClick={handleNodeDoubleClick}
                nodeTypes={nodeTypes}
                fitView
            >
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default GraphCanvas;
