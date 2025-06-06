const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts,
  'db',
  'sqlite'
];

// Explicitly define source extensions without spreading
defaultConfig.resolver.sourceExts = [
  'js',
  'jsx',
  'ts',
  'tsx',
  'json',
  'mjs',
  'cjs'
];

defaultConfig.transformer = {
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

module.exports = defaultConfig;