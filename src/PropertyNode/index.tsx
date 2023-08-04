import { Handle, Position, useNodeId, useReactFlow } from 'reactflow';

import './index.css';
import { useStateContext } from '../Contexts/contextProvider';
import { useEffect, useState } from 'react';

function PropertyNode({ data, isConnectable, selected }: any) {
	// console.log(selected)
	const reactFlowInstance = useReactFlow();
	// console.log(currentNode)
	const [sn, setSn] = useState<any>();
	const { selectedNode, setSelectedNode } = useStateContext();
	const nodeId = useNodeId();
	useEffect(() => {
		if (nodeId && selected) {
			setSelectedNode(reactFlowInstance.getNode(nodeId));
		}
		return () => {};
	}, [selected, nodeId]);

	const handleStyle = {
		backgroundColor: 'red',
	};

	const divStyle = {
		border: '1px solid red',
	};

	return (
		<div className='text-updater-node' style={selected ? divStyle : {}}>
			<Handle
				style={selected ? handleStyle : {}}
				type='target'
				position={Position.Left}
				isConnectable={isConnectable}
			/>
			<div>
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
				style={selected ? handleStyle : {}}
				type='source'
				position={Position.Right}
				id='output'
				isConnectable={isConnectable}
			/>
		</div>
	);
}

export default PropertyNode;
