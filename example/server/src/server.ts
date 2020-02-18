import path from 'path';
import express from 'express';

interface RuntimeEnv extends NodeJS.ProcessEnv {
	TEST?: string;
}

const { PORT, NODE_ENV, TEST } = process.env;

const port = Number(PORT) || 3000;
const dev = NODE_ENV !== 'production';

// Determine the buildPath based on process environment
const devBuildPath = path.resolve(__dirname, '../../frontend/build');
const prodBuildPath = path.resolve('/opt/app/frontend/build');
const buildPath = dev ? devBuildPath : prodBuildPath;

const app = express();

// Gets the env vars from the deployment process and creates the config
const runtimeEnvConfig: RuntimeEnv = {
	TEST,
};

// Serve the application
app.use(express.static(buildPath));

// Handle the /config route and send JSON with the
// runtime env config as the response
app.get('/config', (_, response) => {
	response.json(runtimeEnvConfig);
});

// Handle every other route with index.html, which contains
// a script tag to the application's JavaScript file(s)
app.get('*', (_, response) => {
	response.sendFile(path.join(buildPath, '/index.html'));
});

app.listen(port, () => console.log(`🚀 Listening internally on port: ${PORT}`));
