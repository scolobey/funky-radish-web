/* global __DEV__ */

module.exports = function (api) {
  api.cache(true);

  const presets = [ ... ];
  const plugins = [
    new BabelPlugin({
  		test: /\.(js|jsx)$/,
  		presets: [
        "@babel/preset-env",
        "@babel/preset-react"
      ],
  		sourceMaps: false,
  		compact: false
  	})
];

  return {
    presets,
    plugins
  };
}
