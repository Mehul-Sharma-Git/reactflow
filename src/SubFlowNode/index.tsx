import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Node, NodeProps } from 'reactflow';
import { useNodeId } from 'reactflow';

import './index.css'
const handleStyle = { left: 10 };

  
function SubFlowNode({data, isConnectable, selected }:any) {
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
  backgroundColor: 'red'
}

const divStyle = {
  border:'1px solid red'
}

  return (
    <div className="parent-node" style={selected?divStyle:{}}>
      <Handle style={selected?handleStyle:{}} type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>

        {/* <input id="text" name="text" onChange={onChange} className="nodrag" value={text} />
        <button onClick={onDelete}>Delete</button> */}
      </div>
      <Handle style={selected?handleStyle:{}} type="source" position={Position.Bottom} id="output" isConnectable={isConnectable} />
    </div>
  );
}

export default SubFlowNode;