import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { Node, NodeProps } from 'reactflow';
import { useNodeId } from 'reactflow';

import './index.css'
const handleStyle = { left: 10 };

  
function TextUpdaterNode({data, isConnectable }:any) {
    const nodeId = useNodeId();
    const [text, setText] = useState("")

    const reactFlowInstance = useReactFlow();
    
    useEffect(() => {
      
      if (nodeId){
        const selectedNode = reactFlowInstance.getNode(nodeId)
        if (selectedNode && selectedNode.data.data.text){
          console.log(selectedNode.data.data.text)
          setText(selectedNode.data.data.text)
        }
        
      }
      return () => {
        
      }
    }, [nodeId, reactFlowInstance])
    
  const onChange = useCallback((evt:any) => {
    // console.log(evt.target.value);
    reactFlowInstance.setNodes((nds) =>
    nds.map((node) => {
        if (node.id === nodeId) {
            // it's important that you create a new object here
            // in order to notify react flow about the change
            node.data.data = { ...data.data,
              text:evt.target.value };
        }

        return node;
    })
);
    setText(evt.target.value)
  }, []);

  const onDelete = useCallback((evt:any)=>{

    reactFlowInstance.setNodes((nds)=>
    nds.filter((node)=>{
      return node.id!==nodeId
    })
    )
    
  },[])

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" value={text} />
        <button onClick={onDelete}>Delete</button>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default TextUpdaterNode;