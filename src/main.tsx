import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { Provider } from 'react-redux';
import store from './redux/store/index.tsx';
import { ContextProvider } from './Contexts/contextProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<React.StrictMode>
			<ContextProvider>
				<App />
			</ContextProvider>
		</React.StrictMode>
	</Provider>
);
