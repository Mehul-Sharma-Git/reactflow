import React, { useCallback } from 'react';
import { useStateContext } from '../Contexts/contextProvider';

import './index.css';
import { useReactFlow } from 'reactflow';
const PropertiesBar = () => {
	const { selectedNode, setSelectedNode } = useStateContext();
	const reactFlowInstance = useReactFlow();
	// selectedNode ? console.log(selectedNode.selected) : console.log("no node selected")
	// console.log(selectedNode)
	const onChange = useCallback(
		(e: any) => {
			setSelectedNode((sn: any) => ({
				...sn,
				data: { ...sn.data, [e.target.name]: e.target.value },
			}));
		},
		[selectedNode]
	);
	const saveToState = useCallback(
		(e: any) => {
			reactFlowInstance.setNodes((nds) => {
				nds.map((node: any) => {
					if (node.id === selectedNode.id) {
						// it's important that you create a new object here
						// in order to notify react flow about the change

						node.data = selectedNode.data;
					}

					return node;
				});
				return nds;
			});
		},
		[selectedNode]
	);
	// console.log(selectedNode);
	return selectedNode ? (
		<aside className={`${selectedNode.selected ? '' : 'sliding-bar'}`}>
			<div className='description'>{`Change the properties of the ${selectedNode.type} node`}</div>
			<div className=''>
				{Object.entries(selectedNode.data).map((d: any) => {
					return (
						<>
							{' '}
							<div>{`${d[0]}`}</div>
							<input
								name={d[0]}
								onChange={onChange}
								value={d[1]}
							/>
						</>
					);
				})}
				{/* <label>label:</label>
                        <input value={selectedNode.data.label} onChange={(evt) => setNodeName(evt.target.value)} />

                        <label className="updatenode__bglabel">background:</label>
                        <input value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />

                         */}
				<button onClick={saveToState}>Save to state</button>
			</div>
		</aside>
	) : (
		<aside className='sliding-bar'></aside>
	);
};

export default PropertiesBar;
