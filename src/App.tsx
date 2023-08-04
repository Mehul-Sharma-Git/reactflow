import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import DnDFlow from './DnDFlow';
import { ReactFlowProvider } from 'reactflow';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<ReactFlowProvider>
				<DnDFlow />
			</ReactFlowProvider>
		</>
	);
}

export default App;
