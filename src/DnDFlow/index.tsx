import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    MarkerType,
    useReactFlow,
    Background,
    updateEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from '../Sidebar';

import './index.css';

import TextUpdaterNode from '../TextUpdaterNode';
import CustomNode from '../EasyConnectNode';
import FloatingEdge from '../EasyConnectNode/floatingEdge';
import EasyConnectLine from '../CustomConnectionLine/easyConnectLine';

import ConnectionLine from '../CustomConnectionLine/dottedAnimated';

import EditableEdgeLine from '../CustomConnectionLine/editableEdgeLine'
import SubFlowNode from '../SubFlowNode';
const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'input node', data:{} },
        position: { x: 250, y: 5 },
    },
];

const flowKey = 'example-flow';

let id = 0;
const getId = () => `dndnode_${id++}`;
const nodeTypes = {
    textUpdater: TextUpdaterNode,
    custom: CustomNode,
    parentGroup: SubFlowNode
};


// const edgeTypes = {
//     floating: FloatingEdge,
//     editable:EditableEdgeLine,
    
// };

// const defaultEdgeOptions = {
//     style: { strokeWidth: 3, stroke: 'black' },
//     type: 'floating',
//     markerEnd: {
//         type: MarkerType.ArrowClosed,
//         color: 'black',
//     },
// };

// const connectionLineStyle = {
//     strokeWidth: 3,
//     stroke: 'black',
// };

const DnDFlow = () => {
    const reactFlowWrapper: any = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstanceState, setreactFlowInstanceState] = useState<any>(null);

    const { setViewport} = useReactFlow();
    const reactFlowInstance = useReactFlow()

    const edgeUpdateSuccessful = useRef(true);

    const [nodeName, setNodeName] = useState('Node 1');
    const [nodeBg, setNodeBg] = useState('#eee');
    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
      }, []);
      const onEdgeUpdate = useCallback((oldEdge:any, newConnection:any) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
      }, []);
    
      const onEdgeUpdateEnd = useCallback((_:any, edge:any) => {
        if (!edgeUpdateSuccessful.current) {
          setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
    
        edgeUpdateSuccessful.current = true;
      }, []);
    
    useEffect(() => {
        // Use this for setting noes from json 

        return () => {
            //cleanup
        }
    }, [])
    
    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === '1') {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    node.data = {
                        ...node.data,
                        label: nodeName,
                    };
                }

                return node;
            })
        );
    }, [nodeName, setNodes]);

    useEffect(() => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === '1') {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    node.style = { ...node.style, backgroundColor: nodeBg };
                }

                return node;
            })
        );
    }, [nodeBg, setNodes]);

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), []);

    const onSave = useCallback(() => {
        if (reactFlowInstanceState) {
            console.log(reactFlowInstanceState.toObject())
          const flow = reactFlowInstanceState.toObject();
          localStorage.setItem(flowKey, JSON.stringify(flow));
        }
      }, [reactFlowInstanceState]);

      const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const recoveredFlowKey = localStorage.getItem(flowKey)
          const flow = JSON.parse(recoveredFlowKey?recoveredFlowKey:"{}");
    
          if (JSON.stringify(flow) !=="{}") {
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            setViewport({ x, y, zoom });
          }
        };
    
        restoreFlow();
      }, [setNodes, setViewport]);

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // const onNodeDrag = useCallback((_: any, node: any) => {
    //     const intersections = getIntersectingNodes(node).map((n) => n.id);

    //     setNodes((ns) =>
    //         ns.map((n) => ({
    //             ...n,
    //             className: intersections.includes(n.id) ? 'highlight' : '',
    //         }))
    //     );
    // }, []);

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();
            
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            
            const type = event.dataTransfer.getData('application/reactflow');
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }
            
            const nodes = reactFlowInstance.getNodes()
            
            const position = reactFlowInstanceState.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            let newNode:any
            if (type==='parentGroup'){

                newNode = {
                    id: getId(),
                    type,
                    position,
                    style:{width: 170,
                    height: 140},
                    data: { label: `${type} node`, data:{} },
                };
            } else {
                newNode = {
                    id: getId(),
                    type,
                    position,
                   
                    data: { label: `${type} node`, data:{} },
                };
                
                const isDropOnParentNode = nodes.find((node:any)=>{
                    if(node.type==='parentGroup'&& newNode.position.x>=node.position.x && newNode.position.x<=node.position.x+node.width && newNode.position.y>=node.position.y && newNode.position.y<=node.position.y+node.height){
                        newNode.position.x=newNode.position.x- node.position.x
                        newNode.position.y = newNode.position.y- node.position.y
                        return node
                    }
                    

                })
                
                
                newNode.parentNode = isDropOnParentNode?isDropOnParentNode.id:null
                
            }
            
            

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstanceState]
    );

    const bgColor = "#D3D3D3"
    return (
        <div className="dndflow">
            
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        connectionLineComponent={EasyConnectLine}
                        onInit={setreactFlowInstanceState}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                        style={{ background: bgColor }}
                        nodeTypes={nodeTypes}
                        // edgeTypes={edgeTypes}
                        className="react-flow-subflows-example"
                        // defaultEdgeOptions={defaultEdgeOptions}
                        // connectionLineComponent={CustomConnectionLine}
                        // connectionLineStyle={connectionLineStyle}
                        onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
                        // selectNodesOnDrag={false}
                        // onNodeDrag={onNodeDrag}
                    >
                        <Background />
                        <Controls />
                        <div className="updatenode__controls">
                            <label>label:</label>
                            <input value={nodeName} onChange={(evt) => setNodeName(evt.target.value)} />

                            <label className="updatenode__bglabel">background:</label>
                            <input value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />

                            <button onClick={onSave}>save</button>
        <button onClick={onRestore}>restore</button>
                        </div>
                    </ReactFlow>
                </div>
                <Sidebar />
           
        </div>
    );
};

export default DnDFlow;
