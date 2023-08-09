import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Node, NodeProps } from 'reactflow';
import { useNodeId } from 'reactflow';

import './index.css';
import { useStateContext } from '../Contexts/contextProvider';
const handleStyle = { left: 10 };

function SubFlowNode({ data, isConnectable, selected }: any) {
	const { nodes } = useStateContext();
	const nodeId = useNodeId();
	const reactFlowInstance = useReactFlow();
	const [targetElement, setTargetElement] = useState(false);
	const [divSelected, setDivSelected] = useState('');
	const { setNodes } = useStateContext();
	const {
		selectedNode,
		setSelectedNode,
		dragOverParentNode,
		setDragOverParentNode,
	} = useStateContext();

	useEffect(() => {
		if (nodeId && selected) {
			setSelectedNode(reactFlowInstance.getNode(nodeId));
		}
		return () => {};
	}, [selected, nodeId]);

	// const nodeId = useNodeId();
	// const [text, setText] = useState("")

	// const reactFlowInstance = useReactFlow();

	// useEffect(() => {

	//   if (nodeId){
	//     const selectedNode = reactFlowInstance.getNode(nodeId)
	//     if (selectedNode && selectedNode.data.data.text){
	//       console.log(selectedNode.data.data.text)
	//       setText(selectedNode.data.data.text)
	//     }

	//   }
	//   return () => {

	//   }
	// }, [nodeId, reactFlowInstance])

	//   const onChange = useCallback((evt:any) => {
	//     // console.log(evt.target.value);
	//     reactFlowInstance.setNodes((nds) =>
	//     nds.map((node) => {
	//         if (node.id === nodeId) {
	//             // it's important that you create a new object here
	//             // in order to notify react flow about the change
	//             node.data.data = { ...data.data,
	//               text:evt.target.value };
	//         }

	//         return node;
	//     })
	// );
	//     setText(evt.target.value)
	//   }, []);

	//   const onDelete = useCallback((evt:any)=>{

	//     reactFlowInstance.setNodes((nds)=>
	//     nds.filter((node)=>{
	//       return node.id!==nodeId
	//     })
	//     )

	//   },[])

	const handleStyle = {
		backgroundColor: 'red',
	};

	const divStyle = {
		border: '1px solid #30b3ff',
	};

	const nodeStyle = {
		width: '140px',
		height: '36px',
		border: '1px solid black',
		margin: '2px',
		borderRadius: '5px',
		// marginBottom: '1px',
	};

	const dragSelectedStyle = {
		height: '200px',
		border: '1px solid #30b3ff',
	};
	const dragStyle = {
		height: '200px',
	};

	const onDragEnter = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setTargetElement(e.target);
		// setNodes((nds: any) =>
		// 	nds.map((node: any) => {
		// 		if (node.id === nodeId) {
		// 			node.height += 30;
		// 		}
		// 		return node;
		// 	})
		// );
		setDragOverParentNode(nodeId);
		console.log('drag enter');
	};
	const onDragLeave = (e: any) => {
		console.log(targetElement);
		console.log(e.target);
		if (targetElement === e.target) {
			e.preventDefault();
			e.stopPropagation();
			// setNodes((nds: any) =>
			// 	nds.map((node: any) => {
			// 		if (node.id === nodeId) {
			// 			node.height -= 30;
			// 		}
			// 		return node;
			// 	})
			// );

			setDragOverParentNode('');
			console.log('drag leave');
		}
	};
	const onDrop = (e: any) => {
		setDragOverParentNode('');
		console.log('dropping');
	};
	const onDragStart = (event: any, nodeId: any) => {
		event.dataTransfer.setData('application/childNode', nodeId);
		event.dataTransfer.effectAllowed = 'move';
	};

	const OnClick = (e: any, id: any) => {
		setDivSelected(id);
		setSelectedNode(
			nodes.find((node: any) => {
				return node.id === id;
			})
		);
		setNodes((nds: any) =>
			nds.map((node: any) => {
				node.id === id
					? (node.selected = true)
					: (node.selected = false);
				return node;
			})
		);
	};
	const selectedBorderStyle = {
		border: '1px solid #30b3ff',
		width: '140px',
		height: '36px',
		borderRadius: '5px',
		margin: '2px',
	};
	// console.log(nodes);
	return (
		<div
			className='parent-node'
			style={selected ? divStyle : {}}
			onDragEnterCapture={onDragEnter}
			onDragLeaveCapture={onDragLeave}
			onDrop={onDrop}>
			<Handle
				// style={selected ? handleStyle : {}}
				className='custom-handle'
				type='target'
				position={Position.Left}
				isConnectable={isConnectable}
			/>
			<div
				style={{
					margin: '10px auto 10px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					pointerEvents: `${
						dragOverParentNode === nodeId ? 'none' : 'auto'
					}`,
				}}>
				<div style={{ margin: '10px auto' }}>WebPageNode</div>
				{nodes.map((node: any) => {
					// node.id === nodeId ? console.log(node) : null;
					// node.id === nodeId ? console.log(node.nodes?.length) : null;
					if (node.id === nodeId && node.nodes?.length > 0) {
						return node.nodes.map((nd: any) => {
							return (
								<div
									key={nd.id}
									className={`${
										node.selected ? '' : ''
									} nodrag `}
									draggable
									style={
										nodes.find((node: any) => {
											return node.id === nd.id
												? node.selected
												: null;
										})
											? selectedBorderStyle
											: nodeStyle
									}
									onClick={(e) => OnClick(e, nd.id)}
									onDragStart={(e: any) => {
										onDragStart(e, nd.id);
									}}>
									<p style={{ fontSize: '9px' }}>{nd.id}</p>
								</div>
							);
						});
					}
				})}

				{dragOverParentNode === nodeId ? (
					<div
						style={{
							margin: '2px auto',
							width: '140px',
							height: '36px',
							border: '1px dotted grey',
							fontSize: '10px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: '5px',
						}}>
						Drag Child Node
					</div>
				) : null}
				{/* <input id="text" name="text" onChange={onChange} className="nodrag" value={text} />
        <button onClick={onDelete}>Delete</button> */}
			</div>
			<Handle
				// style={selected ? handleStyle : {}}
				className='custom-handle'
				type='source'
				position={Position.Right}
				id='output'
				isConnectable={isConnectable}
			/>
		</div>
	);
}

export default SubFlowNode;
