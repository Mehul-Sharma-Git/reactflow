import { createContext, ReactNode, useContext, useState } from 'react';
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
interface ContextProps {
	selectedNode?: any;
	setSelectedNode?: any;
	tree?: any;
	setTree?: any;
	nodes?: any;
	setNodes?: any;
	edges?: any;
	setEdges?: any;
	dragOverParentNode?: any;
	setDragOverParentNode?: any;
}
const StateContext = createContext<ContextProps>({});

type Tree = {
	entryNodeId: string;
	nodes: any;
	staticNodes: {
		successFinalNode: { position: { x: Number; y: Number } };
		failureFinalNode: { position: { x: Number; y: Number } };
		initialNode: { position: { x: Number; y: Number } };
	};
};
const initialTree: Tree = {
	entryNodeId: '',
	nodes: {},
	staticNodes: {
		successFinalNode: { position: { x: 100, y: 300 } },
		failureFinalNode: { position: { x: 400, y: 300 } },
		initialNode: { position: { x: 250, y: -300 } },
	},
};
interface ContextProviderProps {
	children?: ReactNode;
}

type CustomNode = Node & {
	output?: any;
};

const initialNodes: CustomNode[] = [
	{
		id: 'initialNode',
		type: 'initial',
		data: { label: 'initial node' },
		// className: 'initial-node',
		position: { x: -150, y: 0 },

		// style: { width: '0px', height: '0px' },
	},
	{
		id: 'SuccessFinalNode',
		type: 'finalPositive',
		data: { label: 'success node' },

		position: { x: 400, y: -100 },
	},
	{
		id: 'FailureFinalNode',
		type: 'finalNegative',
		data: { label: 'failure node' },

		position: { x: 400, y: 300 },
	},
];

export const ContextProvider = ({ children }: ContextProviderProps) => {
	const [selectedNode, setSelectedNode] = useState(null);
	const [tree, setTree] = useState<any>(initialTree);
	const [nodes, setNodes] = useState<CustomNode[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>([]);
	const [dragOverParentNode, setDragOverParentNode] = useState(false);
	return (
		<StateContext.Provider
			value={{
				selectedNode,
				setSelectedNode,
				tree,
				setTree,
				nodes,
				setNodes,
				edges,
				setEdges,
				dragOverParentNode,
				setDragOverParentNode,
			}}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
