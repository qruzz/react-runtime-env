"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const { PORT, NODE_ENV, TEST } = process.env;
const port = Number(PORT) || 3000;
const dev = NODE_ENV !== 'production';
// Determine the buildPath based on process environment
const devBuildPath = path_1.default.resolve(__dirname, '../../frontend/build');
const prodBuildPath = path_1.default.resolve('/opt/app/frontend/build');
const buildPath = dev ? devBuildPath : prodBuildPath;
const app = express_1.default();
// Gets the env vars from the deployment process and creates the config
const runtimeEnvConfig = {
    TEST,
};
// Serve the application
app.use(express_1.default.static(buildPath));
// Handle the /config route and send JSON with the
// runtime env config as the response
app.get('/config', (_, response) => {
    response.json(runtimeEnvConfig);
});
// Handle every other route with index.html, which contains
// a script tag to the application's JavaScript file(s)
app.get('*', (_, response) => {
    response.sendFile(path_1.default.join(buildPath, '/index.html'));
});
app.listen(port, () => console.log(`🚀 Listening internally on port: ${PORT}`));
