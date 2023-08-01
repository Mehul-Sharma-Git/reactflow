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
    Edge
} from 'reactflow';
import CustomNode from '../EasyConnectNode';

type CustomNode = Node & {
    output? :any
}
// interface parentGroupNode extends Node[] {
//     id:string,
//     type: string,
//     position: any,
//     style: any,
//     data: any,
//     parentNode?: any
// }
const getNewNode =(type:any, position:any, nodes: CustomNode[]): CustomNode=>{

    
    let id = 0;
const getId = () => `dndnode_${id++}`;
let newNode: CustomNode
    switch (type){
        case 'parentGroup':
            newNode= {
                id: getId(),
                type,
                position,
                style: {
                    width: 170,
                    height: 140
                },
                output: {
                    id:'output',
                    displayName: 'output'
                },
                data: { label: `${type} node`, data: {} },
            };
            const isDropOnParentNode = nodes.find((node: any) => {
                if (node.type === 'parentGroup' && newNode.position.x >= node.position.x && newNode.position.x <= node.position.x + node.width && newNode.position.y >= node.position.y && newNode.position.y <= node.position.y + node.height) {
                    newNode.position.x = newNode.position.x - node.position.x
                    newNode.position.y = newNode.position.y - node.position.y
                    return node
                }
    
    
            })
    
    
            newNode.parentNode = isDropOnParentNode ? isDropOnParentNode.id : undefined
            return newNode
            default :
                newNode = {
                    id: getId(),
                    type,
                    position,
                    output:[
                        { id:'true',
                    displayName:'True'},
                    { id:'false',
                    displayName:'False'},
                    ],
                    data: { label: `${type} node`, data: {} },
                };
                return newNode
                
    }

}

export default getNewNode