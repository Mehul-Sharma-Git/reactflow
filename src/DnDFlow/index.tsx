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
	BezierEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from '../Sidebar';

import './index.css';

import TextUpdaterNode from '../DecisionNode';
// import CustomNode from '../EasyConnectNode';
// import FloatingEdge from '../EasyConnectNode/floatingEdge';
// import EasyConnectLine from '../CustomConnectionLine/easyConnectLine';

import ConnectionLine from '../CustomConnectionLine/dottedAnimated';

import EditableEdgeLine from '../CustomConnectionLine/editableEdgeLine';
import SubFlowNode from '../SubFlowNode';
import GetNewNode from '../CreateNewNode';
import PropertiesBar from '../PropertiesBar';
import PropertyNode from '../PropertyNode';
import { useStateContext } from '../Contexts/contextProvider';
import checkParentNodeDrop from '../CheckParentNodeDrop';
import InitialNode from '../InitialNode';
import SuccessNode from '../SuccessNode';
import FailureNode from '../FailureNode';
import DecisionNode from '../DecisionNode';

type CustomNode = Node & {
	output?: any;
};

const flowKey = 'example-flow';

const nodeTypes = {
	decision: DecisionNode,
	// custom: CustomNode,
	parentGroup: SubFlowNode,
	property: PropertyNode,
	initial: InitialNode,
	finalPositive: SuccessNode,
	finalNegative: FailureNode,
};

// const edgeTypes = {
// 	floating: FloatingEdge,
// 	editable: EditableEdgeLine,
// };

const defaultEdgeOptions = {
	style: { strokeWidth: 1, stroke: '#30b3ff' },
	type: 'floating',
	markerEnd: {
		type: MarkerType.ArrowClosed,
		color: '#30b3ff',
	},
};

const connectionLineStyle = {
	strokeWidth: 1,
	stroke: '#30b3ff',
};
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
	const {
		nodes,
		setNodes,
		edges,
		setEdges,
		setDragOverParentNode,
	} = useStateContext();
	const [reactFlowInstanceState, setreactFlowInstanceState] = useState<any>(
		null
	);
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
	// console.log(nodes);
	const onEdgesChange = useCallback((changes: any) => {
		// console.log('edge changes');
		// console.log(changes);
		setEdges((eds: Edge<any>[]) => applyEdgeChanges(changes, eds));
	}, []);

	// console.log(reactFlowInstanceState);
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

	// const getIntersectingNodes = (e: any, node: any) => {};
	const onNodeDrag = useCallback(
		(_: any, node: any) => {
			// const intersections = getIntersectingNodes(node).map((n: any) => n.id);
			// setNodes((ns: any) =>
			// 	ns.map((n: any) => ({
			// 		...n,
			// 		className: intersections.includes(n.id) ? 'highlight' : '',
			// 	}))
			// );
			// console.log(node);
			// getIntersectingNodes(_, node);
			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			console.log(reactFlowInstanceState);
			const position = reactFlowInstanceState.project({
				x: _.clientX - reactFlowBounds.left,
				y: _.clientY - reactFlowBounds.top,
			});
			const isDropOnParentNode = nodes.find((nd: any) => {
				if (
					nd.type === 'parentGroup' &&
					node.type !== 'parentGroup' &&
					position.x >= nd.position.x &&
					position.x <= nd.position.x + nd.width &&
					position.y >= nd.position.y &&
					position.y <= nd.position.y + nd.height
				) {
					console.log('drag');
					// newNode.position.x = newNode.position.x - node.position.x;
					// newNode.position.y = newNode.position.y - node.position.y;
					// newNode.position.x = 10;
					setDragOverParentNode(nd.id);
					// newNode.position.y = node.nodes ? node.nodes.length * 42 + 41 : 41;
					return nd;
				} else {
					setDragOverParentNode('');
				}
			});
		},
		[reactFlowInstanceState, nodes]
	);

	const onNodeDragStart = useCallback(() => {
		console.log('drag start');
	}, []);

	const onNodeDragStop = useCallback(
		(e: any, node: any) => {
			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const position = reactFlowInstanceState.project({
				x: e.clientX - reactFlowBounds.left,
				y: e.clientY - reactFlowBounds.top,
			});

			const isDropOnParentNode = nodes.find((nd: any) => {
				if (
					nd.type === 'parentGroup' &&
					node.type !== 'parentGroup' &&
					position.x >= nd.position.x &&
					position.x <= nd.position.x + nd.width &&
					position.y >= nd.position.y &&
					position.y <= nd.position.y + nd.height
				) {
					// newNode.position.x = newNode.position.x - node.position.x;
					// newNode.position.y = newNode.position.y - node.position.y;
					// newNode.position.x = 10;
					setDragOverParentNode('');
					// newNode.position.y = node.nodes ? node.nodes.length * 42 + 41 : 41;
					return nd;
				}
			});

			if (isDropOnParentNode) {
				console.log(isDropOnParentNode);
				const { position, output, parentNode, ...childNode } = node;
				// console.log(childNode);
				setNodes((nds: any) =>
					nds.map((nd: any) => {
						console.log(nd);
						if (nd.id === isDropOnParentNode.id) {
							const foundNode = nd.nodes.find((node: any) => {
								return node.id === childNode.id;
							});
							if (!foundNode) {
								nd.nodes.push(childNode);
							}
						}

						if (nd.id === node.id) {
							nd.parentNode = isDropOnParentNode.id;
							nd.extent = 'parent';
							// newNode.draggable= isDropOnParentNode ? false : true;
							nd.hidden = true;
						}
						// console.log(nd);
						return nd;
					})
				);
			}

			// if (nd.id === node.id) {

			// 	node.hidden = true;
			// 	// node.parentNode =
			// 	return node
			// }
			console.log('drag stop');
		},
		[reactFlowInstanceState, nodes]
	);

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
	const bgColor = '#F5F5F5';
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
					// connectionLineComponent={EasyConnectLine}
					onInit={setreactFlowInstanceState}
					onDrop={onDrop}
					onDragOver={onDragOver}
					fitView
					style={{ background: bgColor }}
					nodeTypes={nodeTypes}
					// edgeTypes={edgeTypes}
					// className='react-flow-subflows-example'
					defaultEdgeOptions={defaultEdgeOptions}
					// connectionLineComponent={CustomConnectionLine}
					// connectionLineStyle={connectionLineStyle}
					// connectionLineType='step'
					onEdgeUpdate={onEdgeUpdate}
					onEdgeUpdateStart={onEdgeUpdateStart}
					onEdgeUpdateEnd={onEdgeUpdateEnd}
					onPaneClick={onClick}
					// selectNodesOnDrag={false}
					onNodeDrag={onNodeDrag}
					onNodeDragStart={onNodeDragStart}
					onNodeDragStop={onNodeDragStop}>
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
