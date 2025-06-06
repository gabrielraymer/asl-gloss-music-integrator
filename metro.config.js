const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts,
  'db',
  'sqlite'
];

defaultConfig.resolver.sourceExts = [
  ...defaultConfig.resolver.sourceExts,
  'mjs',
  'cjs'
];

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

defaultConfig.watchFolders = [
  ...(defaultConfig.watchFolders || []),
  'node_modules'
];

defaultConfig.resolver.unstable_enablePackageExports = true;

module.exports = defaultConfig;