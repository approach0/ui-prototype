var webpack = require('webpack')
var VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  performance: { hints: false },
  entry: __dirname + '/main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
        { test: /\.vue$/, use: 'vue-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader']},
        { test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
          use: [{
            loader: 'file-loader',
            options: {
              outputPath: 'fonts/',
              publicPath: 'dist/fonts/'
            }
          }]
        }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new VueLoaderPlugin()
  ]
}
