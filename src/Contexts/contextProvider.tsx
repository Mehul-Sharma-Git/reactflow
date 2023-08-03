
import { createContext, ReactNode, useContext, useState } from "react";

interface ContextProps {
  selectedNode?:any,
  setSelectedNode?: any,
  tree?: any,
  setTree?:any
}
const StateContext = createContext<ContextProps>({});

type Tree ={
    "entryNodeId": string,
    "nodes": any,
    "staticNodes": {
        "successFinalNode": { "position": { x: Number, y: Number } },
        "failureFinalNode": { "position": { x: Number, y: Number } },
        "initialNode": { "position": { x: Number, y: Number } }
    },
}
const initialTree: Tree = {
    "entryNodeId": "",
    "nodes": {},
    "staticNodes": {
        "successFinalNode": { "position": { x: 100, y: 300 } },
        "failureFinalNode": { "position": { x: 400, y: 300 } },
        "initialNode": { "position": { x: 250, y: -300 } }
    },

}
interface ContextProviderProps {
  children?: ReactNode;
}
export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [selectedNode, setSelectedNode] = useState(null)
  const [tree, setTree] = useState<any>(initialTree)
  return (
    <StateContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
        tree, setTree
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

