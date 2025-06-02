const { getDefaultConfig } = require('expo/metro-config');
const { resolver: { sourceExts, assetExts } } = getDefaultConfig(__dirname);

const config = getDefaultConfig(__dirname);

// Add additional asset extensions
config.resolver.assetExts = [...assetExts, 'db', 'sqlite'];

// Add additional source extensions including TypeScript
config.resolver.sourceExts = [
  ...sourceExts,
  'mjs',
  'cjs',
  'ts',
  'tsx'
];

// Configure the watchFolders to include node_modules
config.watchFolders = [
  ...config.watchFolders || [],
  'node_modules'
];

// Configure the transformer
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    // Terser options
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true
    }
  }
};

module.exports = config;