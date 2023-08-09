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
import checkParentNodeDrop from '../CheckParentNodeDrop';
// import CustomNode from '../EasyConnectNode';

type CustomNode = Node & {
	output?: any;
	nodes?: any;
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
				nodes:[],
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
		case 'decision':
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
	
	const updatedNode = checkParentNodeDrop(newNode, nodes, setNodes)

	return updatedNode;
};

export default GetNewNode;
