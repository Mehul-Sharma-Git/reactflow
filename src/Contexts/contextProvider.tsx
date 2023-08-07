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
		type: 'input',
		data: { label: 'initial node' },

		position: { x: 250, y: -300 },
	},
	{
		id: 'SuccessFinalNode',
		type: 'output',
		data: { label: 'success node' },

		position: { x: 100, y: 300 },
	},
	{
		id: 'FailureFinalNode',
		type: 'output',
		data: { label: 'failure node' },

		position: { x: 400, y: 300 },
	},
];

export const ContextProvider = ({ children }: ContextProviderProps) => {
	const [selectedNode, setSelectedNode] = useState(null);
	const [tree, setTree] = useState<any>(initialTree);
	const [nodes, setNodes] = useState<CustomNode[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>([]);
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
			}}>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
