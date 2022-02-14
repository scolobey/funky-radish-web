var nodeExternals = require('webpack-node-externals');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
      new webpack.DefinePlugin({ // <-- key to reducing React's size
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.DedupePlugin(), //dedupe similar code
      new webpack.optimize.UglifyJsPlugin(), //minify everything
      new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
};
