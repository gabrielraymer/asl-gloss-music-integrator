const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add additional asset extensions
defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts,
  'db',
  'sqlite'
];

// Add additional source extensions including TypeScript
defaultConfig.resolver.sourceExts = [
  ...defaultConfig.resolver.sourceExts,
  'ts',
  'tsx',
  'mjs',
  'cjs'
];

// Configure the transformer with proper Babel setup while preserving default behavior
defaultConfig.transformer = {
  ...defaultConfig.transformer,
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

// Configure the watchFolders to include node_modules
defaultConfig.watchFolders = [
  ...(defaultConfig.watchFolders || []),
  'node_modules'
];

// Enable package exports resolution
defaultConfig.resolver.unstable_enablePackageExports = true;

module.exports = defaultConfig;