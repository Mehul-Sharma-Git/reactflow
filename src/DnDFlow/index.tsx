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
	Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from '../Sidebar';

import './index.css';

import TextUpdaterNode from '../TextUpdaterNode';
import CustomNode from '../EasyConnectNode';
import FloatingEdge from '../EasyConnectNode/floatingEdge';
import EasyConnectLine from '../CustomConnectionLine/easyConnectLine';

import ConnectionLine from '../CustomConnectionLine/dottedAnimated';

import EditableEdgeLine from '../CustomConnectionLine/editableEdgeLine';
import SubFlowNode from '../SubFlowNode';
import GetNewNode from '../CreateNewNode';
import PropertiesBar from '../PropertiesBar';
import PropertyNode from '../PropertyNode';
import { useStateContext } from '../Contexts/contextProvider';

type CustomNode = Node & {
	output?: any;
};

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
	parentGroup: SubFlowNode,
	property: PropertyNode,
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

const CustomNodeToTreeNode = (node: CustomNode) => {
	return {
		id: node.id,
		connections: node.output.map((output: any) => {
			return { [output.id]: '' };
		}),
		type: node.type,
	};
};
const DnDFlow = () => {
	const reactFlowWrapper: any = useRef(null);
	const { tree, setTree } = useStateContext();
	const { selectedNode, setSelectedNode } = useStateContext();
	// console.log(tree);
	const { nodes, setNodes, edges, setEdges } = useStateContext();
	const onNodesChange = useCallback((changes: any) => {
		// console.log('on nodes change');
		setNodes((nds: any) => applyNodeChanges(changes, nds));

		if (
			changes[0].type === 'position' &&
			changes[0].dragging === true &&
			(changes[0].id === 'successFinalNode' ||
				changes[0].id === 'failureFinalNode' ||
				changes[0].id === 'initialNode')
		) {
			setTree((tr: any) => ({
				...tr,
				staticNodes: {
					...tr.staticNodes,
					[changes[0].id]: {
						position: {
							x: changes[0].position.x,
							y: changes[0].position.y,
						},
					},
				},
			}));
		} else if (changes[0].type === 'remove') {
			const removeID = changes[0].id;
			// console.log(changes);
			setTree((tr: any) => {
				const copy = { ...tr };

				delete copy.nodes[removeID];

				for (const eachNode in copy.nodes) {
					copy.nodes[eachNode].connections.map((elem: any) => {
						Object.keys(elem).map((key: any) => {
							return (elem[key] =
								elem[key] === removeID ? '' : elem[key]);
						});
						return elem;
					});
				}
				return copy;
			});
			setNodes((nds: any) =>
				nds.map((node: any) => {
					node.nodes = node.nodes
						? node.nodes.filter((nd: any) => {
								return nd.id !== changes[0].id;
						  })
						: null;
					return node;
				})
			);
		}
	}, []);
	console.log(nodes);
	const onEdgesChange = useCallback((changes: any) => {
		// console.log('edge changes');
		// console.log(changes);
		setEdges((eds: Edge<any>[]) => applyEdgeChanges(changes, eds));
	}, []);

	const [reactFlowInstanceState, setreactFlowInstanceState] = useState<any>(
		null
	);

	const { setViewport } = useReactFlow();

	const edgeUpdateSuccessful = useRef(true);

	const onEdgeUpdateStart = useCallback(() => {
		// console.log('start');
		// console.log(tree);
		edgeUpdateSuccessful.current = false;
	}, [tree]);
	const onEdgeUpdate = useCallback(
		(oldEdge: any, newConnection: any) => {
			// console.log('edge update');
			// console.log(oldEdge);
			// console.log(newConnection);
			// console.log(tree);
			edgeUpdateSuccessful.current = true;
			setEdges((els: Edge[]) => updateEdge(oldEdge, newConnection, els));
		},
		[tree]
	);

	const onEdgeUpdateEnd = useCallback(
		(_: any, edge: any) => {
			if (!edgeUpdateSuccessful.current) {
				setEdges((eds: any[]) =>
					eds.filter((e: { id: any }) => e.id !== edge.id)
				);
			}
			if (edge.source === 'initialNode') {
				setTree((tr: any) => ({ ...tr, entryNodeId: '' }));
			} else {
				setTree((tr: any) => ({
					...tr,
					nodes: {
						...tr.nodes,
						[edge.source]: {
							...tr.nodes[edge.source],
							connections: tr.nodes[edge.source].connections.map(
								(elem: any) => {
									elem.hasOwnProperty(edge.sourceHandle)
										? (elem[edge.sourceHandle] = '')
										: null;
									return elem;
								}
							),
						},
					},
				}));
			}

			edgeUpdateSuccessful.current = true;
		},
		[tree]
	);

	useEffect(() => {
		// Use this for setting noes from json

		return () => {
			//cleanup
		};
	}, []);

	// useEffect(() => {
	//     setNodes((nds: any) =>
	//         nds.map((node: { id: string; data: any; }) => {
	//             if (node.id === '1') {
	//                 // it's important that you create a new object here
	//                 // in order to notify react flow about the change
	//                 node.data = {
	//                     ...node.data,
	//                     label: nodeName,
	//                 };
	//             }

	//             return node;
	//         })
	//     );
	// }, [nodeName, setNodes]);

	// useEffect(() => {
	//     setNodes((nds: any) =>
	//         nds.map((node: { id: string; style: any; }) => {
	//             if (node.id === '1') {
	//                 // it's important that you create a new object here
	//                 // in order to notify react flow about the change
	//                 node.style = { ...node.style, backgroundColor: nodeBg };
	//             }

	//             return node;
	//         })
	//     );
	// }, [nodeBg, setNodes]);

	const onConnect = useCallback(
		(params: any) => {
			// console.log(tree);
			// console.log('onConnect');
			if (params.source === 'initialNode') {
				setTree((tr: any) => ({ ...tr, entryNodeId: params.target }));
			} else {
				setTree((tr: any) => ({
					...tr,
					nodes: {
						...tr.nodes,
						[params.source]: {
							...tr.nodes[params.source],
							connections: tr.nodes[
								params.source
							].connections.map((elem: any) => {
								elem.hasOwnProperty(params.sourceHandle)
									? (elem[params.sourceHandle] =
											params.target)
									: null;
								return elem;
							}),
						},
					},
				}));
			}

			setEdges((eds: Edge[]) => addEdge(params, eds));
		},
		[tree]
	);

	const onSave = useCallback(() => {
		if (reactFlowInstanceState) {
			// console.log(reactFlowInstanceState.toObject());
			const flow = reactFlowInstanceState.toObject();
			localStorage.setItem(flowKey, JSON.stringify(flow));
		}
	}, [reactFlowInstanceState]);

	const onRestore = useCallback(() => {
		const restoreFlow = async () => {
			const recoveredFlowKey = localStorage.getItem(flowKey);
			const flow = JSON.parse(recoveredFlowKey ? recoveredFlowKey : '{}');

			if (JSON.stringify(flow) !== '{}') {
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

	const onClick = (e: any) => {
		if (selectedNode) {
			setSelectedNode((prevNode: any) => ({
				...prevNode,
				selected: false,
			}));
		}
	};

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

			if (event.dataTransfer.getData('application/childNode')) {
				const nodeId = event.dataTransfer.getData(
					'application/childNode'
				);
				setNodes((nds: any) =>
					nds.map((node: any) => {
						if (node.id === nodeId) {
							node.hidden = false;
							node.draggable = true;
							node.parentNode = undefined;
							node.extent = undefined;
							const position = reactFlowInstanceState.project({
								x: event.clientX - reactFlowBounds.left,
								y: event.clientY - reactFlowBounds.top,
							});
							node.position = position;
						}
						node.nodes = node.nodes
							? node.nodes.filter((nd: any) => {
									return nd.id !== nodeId;
							  })
							: null;
						return node;
					})
				);
			}
			const type = event.dataTransfer.getData('application/reactflow');
			// check if the dropped element is valid
			if (typeof type === 'undefined' || !type) {
				return;
			}

			// const nodes = reactFlowInstance.getNodes()
			const position = reactFlowInstanceState.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			});

			const newNode = GetNewNode(type, position, nodes, setNodes);

			// console.log(CustomNodeToTreeNode(newNode))
			setNodes((nds: any[]) => nds.concat(newNode));
			setTree((tr: any) => ({
				...tr,
				nodes: {
					...tr.nodes,
					[newNode.id]: CustomNodeToTreeNode(newNode),
				},
			}));
		},
		[reactFlowInstanceState, nodes]
	);

	const downloadFile = ({ data, fileName, fileType }: any) => {
		// Create a blob with the data we want to download as a file
		const blob = new Blob([data], { type: fileType });
		// Create an anchor element and dispatch a click event on it
		// to trigger a download
		const a = document.createElement('a');
		a.download = fileName;
		a.href = window.URL.createObjectURL(blob);
		const clickEvt = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true,
		});
		a.dispatchEvent(clickEvt);
		a.remove();
	};
	const getJSON = (e: any) => {
		e.preventDefault();
		const mainNodes = nodes.filter((node: any) => {
			return node.parentNode === undefined;
		});
		const innerNodes = nodes.filter((node: any) => {
			return node.parentNode !== undefined;
		});
		const requiredMainNodes = mainNodes.reduce(
			(accumulator: any, value: any) => {
				return { ...accumulator, [value.id]: value };
			},
			{}
		);
		const requiredInnerNodes = innerNodes.reduce(
			(accumulator: any, value: any) => {
				return { ...accumulator, [value.id]: value };
			},
			{}
		);
		// console.log(requiredNodes);
		// downloadFile({
		// 	data: JSON.stringify({
		// 		originalNodes: nodes,
		// 		convertedNodes: Object.values(requiredNodes),
		// 	}),
		// 	fileName: 'tree.json',
		// 	fileType: 'text/json',
		// });

		downloadFile({
			data: JSON.stringify({
				journeyId: '1',
				tree: tree,
				nodes: requiredMainNodes,
				innerNodes: requiredInnerNodes,
				edges: edges,
			}),
			fileName: 'tree.json',
			fileType: 'text/json',
		});
	};
	const bgColor = '#F3F3F3';
	// console.log(nodes);
	return (
		<div className='dndflow'>
			<Sidebar />
			<div className='reactflow-wrapper' ref={reactFlowWrapper}>
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
					className='react-flow-subflows-example'
					// defaultEdgeOptions={defaultEdgeOptions}
					// connectionLineComponent={CustomConnectionLine}
					// connectionLineStyle={connectionLineStyle}
					onEdgeUpdate={onEdgeUpdate}
					onEdgeUpdateStart={onEdgeUpdateStart}
					onEdgeUpdateEnd={onEdgeUpdateEnd}
					onPaneClick={onClick}
					// selectNodesOnDrag={false}
					// onNodeDrag={onNodeDrag}
				>
					<Background />
					<Controls />
					<div className='updatenode__controls'>
						<button onClick={onSave}>save</button>
						<button onClick={onRestore}>restore</button>
						<button onClick={getJSON}>Get JSON</button>
					</div>
				</ReactFlow>
			</div>
			<PropertiesBar />
		</div>
	);
};

export default DnDFlow;
