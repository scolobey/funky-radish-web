module.exports = function (api) {
  api.cache(true);

  const presets = [ ... ];
  const plugins = [
    new BabelPlugin({
  		test: /\.js$/,
  		presets: ['es2015'],
  		sourceMaps: false,
  		compact: false
  	})
];

  return {
    presets,
    plugins
  };
}
