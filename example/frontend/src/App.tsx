import React from 'react';
import { useRuntimeEnv } from 'react-runtime-env';
import logo from './logo.svg';
import './App.css';
import { DefaultEnv } from '.';

function App() {
	const { TEST, NODE_ENV } = useRuntimeEnv<DefaultEnv>();
	console.log(TEST);
	console.log(NODE_ENV);
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
