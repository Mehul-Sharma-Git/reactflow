import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath} from 'reactflow';

function EditableEdgeLine({ id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data, }:any) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <><BaseEdge id={id} path={edgePath} />
    <EdgeLabelRenderer>
    <div
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
        background: '#ffcc00',
        padding: 10,
        borderRadius: 5,
        fontSize: 12,
        fontWeight: 700,
      }}
      className="nodrag nopan"
    >
      {data.label}
    </div>
  </EdgeLabelRenderer>
  </>
  );
}

export default EditableEdgeLine;
