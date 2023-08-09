import { Handle, Position, useNodeId, useReactFlow } from 'reactflow';

import './index.css';
// import { useStateContext } from '../Contexts/contextProvider';
// import { useEffect, useState } from 'react';
import { AiOutlineUserSwitch } from 'react-icons/ai';
function InitialNode({ data, isConnectable, selected }: any) {
	// console.log(selected)
	// const reactFlowInstance = useReactFlow();
	// console.log(currentNode)
	// const [sn, setSn] = useState<any>();
	// const { selectedNode, setSelectedNode } = useStateContext();
	// const nodeId = useNodeId();
	// useEffect(() => {
	// 	if (nodeId && selected) {
	// 		setSelectedNode(reactFlowInstance.getNode(nodeId));
	// 	}
	// 	return () => {};
	// }, [selected, nodeId]);

	const handleStyle = {
		backgroundColor: 'white',
		border: '1px solid #30b3ff',
	};

	const divStyle = {
		border: '1px solid #30b3ff',
	};

	return (
		<div className='initial-node' style={selected ? divStyle : {}}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					alignContent: 'center',
					margin: '10px auto',
				}}>
				<AiOutlineUserSwitch color='white' />
				{/* <label htmlFor="text">Text:</label> */}
				{/* <input id="text" name="text" onChange={onChange} className="nodrag" value={text} /> */}
				{/* <button onClick={onDelete}>Delete</button> */}
			</div>

			{/* <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={handleStyle}
        isConnectable={isConnectable}
        content='true'
      /> */}
			<Handle
				style={handleStyle}
				type='source'
				position={Position.Right}
				id='output'
				isConnectable={isConnectable}
			/>
		</div>
	);
}

export default InitialNode;
