import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Node, NodeProps } from 'reactflow';
import { useNodeId } from 'reactflow';

import './index.css';
import { useStateContext } from '../Contexts/contextProvider';

function TextUpdaterNode({ data, isConnectable, selected }: any) {
	const nodeId = useNodeId();
	const [text, setText] = useState('');
	const reactFlowInstance = useReactFlow();
	const [currentNode, setCurrentNode] = useState<any>();
	const { selectedNode, setSelectedNode } = useStateContext();
	useEffect(() => {
		if (nodeId) {
			const selectedNode = reactFlowInstance.getNode(nodeId);
			setCurrentNode(selectedNode);
			if (selectedNode && selectedNode.data.text) {
				setText(selectedNode.data.text);
			}
		}

		return () => {};
	}, [nodeId, reactFlowInstance]);

	useEffect(() => {
		if (nodeId && selected) {
			setSelectedNode(reactFlowInstance.getNode(nodeId));
		}
		return () => {};
	}, [selected, nodeId]);

	// setSelectedNode()
	// console.log(currentNode)
	const onChange = useCallback((evt: any) => {
		// console.log(evt.target.value);
		reactFlowInstance.setNodes((nds) =>
			nds.map((node) => {
				if (node.id === nodeId) {
					// it's important that you create a new object here
					// in order to notify react flow about the change
					node.data = { ...data, text: evt.target.value };
				}

				return node;
			})
		);
		setText(evt.target.value);
	}, []);

	// const onDelete = useCallback((evt:any)=>{

	//   reactFlowInstance.setNodes((nds)=>
	//   nds.filter((node)=>{
	//     return node.id!==nodeId
	//   })
	//   )

	// },[])

	const handleLeftStyle = {
		backgroundColor: 'red',
		top: '8px',
	};
	const handleBackgroundStyle = {
		backgroundColor: 'red',
	};
	const handleTopStyle = { top: 20 };
	const handleBottomStyle = { top: 40 };

	const divStyle = {
		border: '1px solid #30b3ff',
	};
	return (
		<div className='decision-node' style={selected ? divStyle : {}}>
			<Handle
				// style={selected ? handleBackgroundStyle : {}}
				className='custom-handle'
				type='target'
				position={Position.Left}
				isConnectable={isConnectable}
			/>
			<div>
				{/* <label htmlFor="text">{data.label}</label> */}
				{/* <input id="text" name="text" onChange={onChange} className="nodrag" value={text} /> */}
				{/* <button onClick={onDelete}>Delete</button> */}
			</div>

			<Handle
				type='source'
				position={Position.Right}
				id='true'
				style={handleTopStyle}
				isConnectable={isConnectable}
				content='true'
				className={`
				decision-content-handle-true
			custom-handle`}
			/>
			<Handle
				// style={selected ? handleBackgroundStyle : {}}
				type='source'
				position={Position.Right}
				id='false'
				style={handleBottomStyle}
				isConnectable={isConnectable}
				className={`
				decision-content-handle-false
				custom-handle`}
			/>
		</div>
	);
}

export default TextUpdaterNode;
