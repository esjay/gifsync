var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: './dist',
        filename: 'app.bundle.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'GifSync',
        inject: 'body'
      }),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
          }
      })
    ],
    devServer: {
      contentBase: '/dist'
    }
};
