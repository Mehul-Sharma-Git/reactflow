import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import { useStateContext } from '../Contexts/contextProvider';
// import CustomNode from '../EasyConnectNode';

type CustomNode = Node & {
	output?: any;
};
// interface parentGroupNode extends Node[] {
//     id:string,
//     type: string,
//     position: any,
//     style: any,
//     data: any,
//     parentNode?: any
// }
let newNode: CustomNode;
const GetNewNode = (
	type: any,
	position: any,
	nodes: CustomNode[],
	setNodes: any
) => {
	switch (type) {
		case 'parentGroup':
			newNode = {
				id: uuidv4(),
				type,
				position,
				output: [
					{
						id: 'output',
						displayName: 'output',
					},
				],
				data: { label: `${type} node` },
				
			};
			break;
		case 'default':
			newNode = {
				id: uuidv4(),
				type,
				position,
				output: [
					{
						id: 'output',
						displayName: 'output',
					},
				],
				data: { label: `${type} node` },
			};
			break;
		case 'property':
			newNode = {
				id: uuidv4(),
				type,
				position,
				output: [
					{
						id: 'output',
						displayName: 'output',
					},
				],
				data: {
					label: `${type} node`,
					text: '',
					amount: 0,
					boolValue: false,
				},
			};
			break;
		case 'textUpdater':
			newNode = {
				id: uuidv4(),
				type,
				position,
				output: [
					{
						id: 'true',
						displayName: 'True',
					},
					{ id: 'false', displayName: 'False' },
				],
				data: { label: `${type} node`, text: '' },
			};
			break;
		default:
			newNode = {
				id: uuidv4(),
				type,
				position,
				output: [
					{
						id: 'true',
						displayName: 'True',
					},
					{ id: 'false', displayName: 'False' },
				],
				data: { label: `${type} node` },
			};
	}
	const isDropOnParentNode = nodes.find((node: any) => {
	
		if (

			node.type === 'parentGroup' &&
			newNode.position.x >= node.position.x &&
			newNode.position.x <= node.position.x + node.width &&
			newNode.position.y >= node.position.y &&
			newNode.position.y <= node.position.y + node.height
		) {
			// newNode.position.x = newNode.position.x - node.position.x;
			// newNode.position.y = newNode.position.y - node.position.y;
			newNode.position.x = 10 ;
			
			newNode.position.y = node.nodes?node.nodes.length*42 + 41 : 41 ;
			return node;
		}
	});

	if (isDropOnParentNode) {
		const { position, output, parentNode, ...childNode } = newNode;
		setNodes((nds: any) =>
			nds.map((node: any) => {
				node.id === isDropOnParentNode.id
					? (node.nodes
							? (node.nodes.push(childNode),node.height+=30)
							: (node.nodes = [childNode])

					)
					: null;

				return node;
			})
		);
	}

	newNode.parentNode = isDropOnParentNode ? isDropOnParentNode.id : undefined;
	newNode.extent = isDropOnParentNode ? 'parent' : undefined;
	// newNode.draggable= isDropOnParentNode ? false : true;
	newNode.hidden= isDropOnParentNode ? true : false;

	return newNode;
};

export default GetNewNode;
