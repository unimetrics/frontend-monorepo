// eslint-disable-next-line unicorn/prefer-module
const { getDefaultConfig } = require("expo/metro-config");
// eslint-disable-next-line unicorn/prefer-module
const path = require("node:path");

// eslint-disable-next-line unicorn/prefer-module
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.unstable_enableSymlinks = true;

// eslint-disable-next-line unicorn/prefer-module
module.exports = config;
