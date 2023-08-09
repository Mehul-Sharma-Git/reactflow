import { Handle, Position, useNodeId, useReactFlow } from 'reactflow';

import './index.css';
import { useStateContext } from '../Contexts/contextProvider';
import { useEffect, useState } from 'react';
import { TiTick } from 'react-icons/ti';

function SuccessNode({ data, isConnectable, selected }: any) {
	// console.log(selected)
	// const reactFlowInstance = useReactFlow();
	// // console.log(currentNode)
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
		backgroundColor: 'red',
	};

	const divStyle = {
		border: '1px solid #30b3ff',
	};

	return (
		<div className='final-positive-node' style={selected ? divStyle : {}}>
			<Handle
				// style={selected ? handleStyle : {}}
				className='custom-handle'
				type='target'
				position={Position.Left}
				isConnectable={isConnectable}
			/>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					alignContent: 'center',
					margin: '10px auto',
				}}>
				<TiTick color='white' />

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
			{/* <Handle
				style={selected ? handleStyle : {}}
				type='source'
				position={Position.Right}
				id='output'
				isConnectable={isConnectable}
			/> */}
		</div>
	);
}

export default SuccessNode;
