import path from 'path';
import express from 'express';

const { PORT, NODE_ENV } = process.env;

const app = express();

const port = Number(PORT) || 3000;
const buildPath = path.resolve(__dirname, '../build');

const runtimeEnvConfig = {
	REACT_APP_,
};

app.get('/config', (_, response) => {
	response.json(runtimeEnvConfig);
});

app.get('*', (_, response) => {
	response.sendFile(path.join(buildPath, '/index.html'));
});

app.listen(port);
