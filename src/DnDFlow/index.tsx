import React, { useState, useRef, useCallback, useEffect, useId } from 'react';
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
    applyNodeChanges,
    applyEdgeChanges,
    Node,
    Edge
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
import GetNewNode from '../CreateNewNode';

type CustomNode = Node & {
    output?: any
}

const initialNodes: CustomNode[] = [
    {
        id: 'initialNode',
        type: 'input',
        data: { label: 'initial node' },

        position: { x: 250, y: -300 },
    },
    {
        id: 'SuccessFinalNode',
        type: 'output',
        data: { label: 'success node' },

        position: { x: 100, y: 300 },
    },
    {
        id: 'FailureFinalNode',
        type: 'output',
        data: { label: 'failure node' },

        position: { x: 400, y: 300 },
    },
];

const flowKey = 'example-flow';


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

type Tree ={
    "entryNodeId": string,
    "nodes": any,
    "staticNodes": {
        "successFinalNode": { "position": { x: Number, y: Number } },
        "failureFinalNode": { "position": { x: Number, y: Number } },
        "initialNode": { "position": { x: Number, y: Number } }
    },
}
const initialTree: Tree = {
    "entryNodeId": "",
    "nodes": {},
    "staticNodes": {
        "successFinalNode": { "position": { x: 100, y: 300 } },
        "failureFinalNode": { "position": { x: 400, y: 300 } },
        "initialNode": { "position": { x: 250, y: -300 } }
    },

}

const CustomNodeToTreeNode = (node:CustomNode)=>{

    return {
        id:node.id,
        connections: node.output.map((output:any)=>{return {[output.id]:"",}}),
        type: node.type,

    }
}
const DnDFlow = () => {
    const reactFlowWrapper: any = useRef(null);
    const [nodes, setNodes] = useState<CustomNode[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [tree, setTree] = useState<any>(initialTree)
    const onNodesChange = useCallback(
        (changes: any) => {
            
            setNodes((nds) => applyNodeChanges(changes, nds))
            
            if (changes[0].type === 'position' && changes[0].dragging === true && (changes[0].id === "successFinalNode" || changes[0].id === "failureFinalNode" || changes[0].id === "initialNode")) {
                
                setTree((tr: Tree) => ({ ...tr, staticNodes: { ...tr.staticNodes, [changes[0].id]: { position: { x: changes[0].position.x, y: changes[0].position.y } } } }))
            } else if(changes[0].type==='remove'){
                const removeID = changes[0].id
                setTree((tr:Tree)=>{

                    const copy = {...tr}

                    delete copy.nodes[removeID]

                    for (const eachNode in copy.nodes){
                        copy.nodes[eachNode].connections.map((elem:any)=>{Object.keys(elem).map((key:any)=>{return elem[key] = elem[key]===removeID?"":elem[key]}); return elem})
                    }
                    return copy
                })

            }
        },
        []
    );
    const onEdgesChange = useCallback(
        (changes: any) => {
            console.log("edge changes")
            console.log(changes)
            setEdges((eds: Edge<any>[]) => applyEdgeChanges(changes, eds))
            
        },
        []
    );

    const [reactFlowInstanceState, setreactFlowInstanceState] = useState<any>(null);

    const { setViewport } = useReactFlow();
    // const reactFlowInstance = useReactFlow()

    const edgeUpdateSuccessful = useRef(true);

    const [nodeName, setNodeName] = useState('Node 1');
    const [nodeBg, setNodeBg] = useState('#eee');
    const onEdgeUpdateStart = useCallback(() => {

        console.log('start')
        edgeUpdateSuccessful.current = false;
    }, []);
    const onEdgeUpdate = useCallback((oldEdge: any, newConnection: any) => {
        console.log('edge update')
        console.log(oldEdge)
        console.log(newConnection)
        edgeUpdateSuccessful.current = true;
        setEdges((els: Edge[]) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((_: any, edge: any) => {
        console.log('end')
        console.log(_)
        console.log(edge)
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds: any[]) => eds.filter((e: { id: any; }) => e.id !== edge.id));
        }
        setTree((tr:Tree)=>({...tr, nodes:{...tr.nodes, [edge.source]:{...tr.nodes[edge.source], connections: tr.nodes[edge.source].connections.map((elem:any)=>{elem.hasOwnProperty(edge.sourceHandle)? elem[edge.sourceHandle]= "" :null ; return elem})}}}))

        edgeUpdateSuccessful.current = true;
    }, []);

    useEffect(() => {
        // Use this for setting noes from json 

        return () => {
            //cleanup
        }
    }, [])

    useEffect(() => {
        setNodes((nds: any) =>
            nds.map((node: { id: string; data: any; }) => {
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
        setNodes((nds: any) =>
            nds.map((node: { id: string; style: any; }) => {
                if (node.id === '1') {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    node.style = { ...node.style, backgroundColor: nodeBg };
                }

                return node;
            })
        );
    }, [nodeBg, setNodes]);

    const onConnect = useCallback((params: any) => {
        console.log("on connect")
        console.log(params)
        if (params.source==='initialNode'){
            setTree((tr:Tree)=>({...tr, entryNodeId:params.target}))
        }else {
            setTree((tr:Tree)=>({...tr, nodes:{...tr.nodes, [params.source]:{...tr.nodes[params.source], connections: tr.nodes[params.source].connections.map((elem:any)=>{elem.hasOwnProperty(params.sourceHandle)? elem[params.sourceHandle]= params.target :null ; return elem})}}}))
        }

        setEdges((eds: Edge[]) => addEdge(params, eds))
    }, []);

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
            const flow = JSON.parse(recoveredFlowKey ? recoveredFlowKey : "{}");

            if (JSON.stringify(flow) !== "{}") {
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



            const position = reactFlowInstanceState.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode = GetNewNode(type, position, nodes)

            console.log(CustomNodeToTreeNode(newNode))
            setNodes((nds: any[]) => nds.concat(newNode));
            setTree((tr:Tree)=>({...tr, nodes: {...tr.nodes, [newNode.id]:CustomNodeToTreeNode(newNode)}}))
        },
        [reactFlowInstanceState]
    );

    const bgColor = "#D3D3D3"
    console.log(tree)
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
