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

// Configure the transformer with proper Babel setup
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  enableBabelRCLookup: true,
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    keep_classnames: true,
    keep_fnames: true,
    mangle: {
      keep_classnames: true,
      keep_fnames: true
    }
  }
};

module.exports = config;