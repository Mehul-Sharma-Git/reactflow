// import { Handle, Position, useStore } from 'reactflow';

// const connectionNodeIdSelector = (state: any) => state.connectionNodeId;

// const sourceStyle = { zIndex: 1 };

// export default function CustomNode({ id }: any) {
// 	const connectionNodeId = useStore(connectionNodeIdSelector);

// 	const isConnecting = !!connectionNodeId;
// 	const isTarget = connectionNodeId && connectionNodeId !== id;
// 	const label = isTarget ? 'Drop here' : 'Drag to connect';

// 	return (
// 		<div className='customNode'>
// 			<div
// 				className='customNodeBody'
// 				style={{
// 					borderStyle: isTarget ? 'dashed' : 'solid',
// 					backgroundColor: isTarget ? '#ffcce3' : '#ccd9f6',
// 				}}>
// 				{/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
// 				{/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
// 				{!isConnecting && (
// 					<Handle
// 						className='customHandle'
// 						position={Position.Right}
// 						type='source'
// 						style={sourceStyle}
// 					/>
// 				)}

// 				<Handle
// 					className='customHandle'
// 					position={Position.Left}
// 					type='target'
// 				/>
// 				{label}
// 			</div>
// 		</div>
// 	);
// }
