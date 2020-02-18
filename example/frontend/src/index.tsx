import React from 'react';
import ReactDOM from 'react-dom';
import { RuntimeEnvProvider } from 'react-runtime-env';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

export interface DefaultEnv extends NodeJS.ProcessEnv {
	TEST: string;
}

const DEFAULT_ENV: DefaultEnv = {
	TEST: 'Hello World',
	...process.env,
};

ReactDOM.render(
	<RuntimeEnvProvider<DefaultEnv> defaultEnv={DEFAULT_ENV} configPath="/config">
		<App />
	</RuntimeEnvProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
