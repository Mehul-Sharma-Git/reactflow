
import { createContext, ReactNode, useContext, useState } from "react";

interface ContextProps {
  selectedNode?:any,
  setSelectedNode?: any,
}
const StateContext = createContext<ContextProps>({});

interface ContextProviderProps {
  children?: ReactNode;
}
export const ContextProvider = ({ children }: ContextProviderProps) => {
  const [selectedNode, setSelectedNode] = useState(null)

  return (
    <StateContext.Provider
      value={{
        selectedNode,
        setSelectedNode
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

