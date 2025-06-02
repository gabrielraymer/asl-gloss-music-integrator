const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'db',
  'sqlite'
];

// Add additional source extensions including TypeScript
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'mjs',
  'cjs'
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

// Configure the watchFolders to include node_modules
config.watchFolders = [
  ...(config.watchFolders || []),
  'node_modules'
];

// Add transform options to handle TypeScript files in node_modules
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;